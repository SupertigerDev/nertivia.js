import io, { Socket } from 'socket.io-client';

import IAuthenticationData from './Interfaces/AuthenticationData';
import {IClientEvents, clientEventsNames} from './Interfaces/ClientEvents';
import Message from './Message';
import Users from './Users';
import Channels from './Channels';
import Guilds from './Guilds';
import Guild from './Guild';
import Fetch from './Utils/fetch';
import DataManager from './DataManager';
import ClientUser from './ClientUser';
import { PresenceStatusData, PresenceStatus } from './Interfaces/Status';
import ServerMember from './ServerMember';
import _HTMLEmbedBuilder from './HTMLEmbedBuilder';
import Role from './Role';
import Button from './Button';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { AUTHENTICATED, AUTHENTICATION_ERROR, MESSAGE_BUTTON_CLICKED, MESSAGE_CREATED, MESSAGE_DELETED, MESSAGE_UPDATED, SERVER_JOINED, SERVER_LEFT, SERVER_MEMBERS, SERVER_MEMBER_ADDED, SERVER_MEMBER_REMOVED, SERVER_ROLES, SERVER_ROLE_CREATED, SERVER_ROLE_UPDATED, SERVER_UPDATED, USER_CUSTOM_STATUS_CHANGED, USER_STATUS_CHANGED } from './ServerEventNames';

export const HTMLEmbedBuilder = _HTMLEmbedBuilder;
export type HTMLEmbedBuilder = _HTMLEmbedBuilder;

export { default as Collection } from  '@discordjs/collection'

export class Client {
    token: string | null;
    user: ClientUser | undefined;
    listeners: Map<keyof IClientEvents | any, any>;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>
    users: Users;
    channels: Channels;
    guilds: Guilds;
    fetch: Fetch;
    dataManager: DataManager;
    constructor() {
        this.token = null;
        this.user = undefined;
        this.listeners = new Map();
        this.socket = io('https://nertivia.net', { autoConnect: true, transports: ["websocket"] });
        // this.socket = io('http://localhost/', { autoConnect: false });
        this.users = new Users(this);
        this.channels = new Channels(this);
        this.guilds = new Guilds(this);
        this.fetch = new Fetch(this);
        this.dataManager = new DataManager(this);
    }

    login(token: string) {
        return new Promise((resolve, reject) => {
            if (this.token) reject(new Error("Already logged in."));
            this.token = token;
            this.socket.connect();
            const connectEvent = () => {
                this.socket.off()
                this.socket.offAny();
                this.socket.emit('authentication', {token})
                this.socket.once(AUTHENTICATED, (data: IAuthenticationData) => {
                    resolve("success");
                    this.socket.off(AUTHENTICATION_ERROR)
                    this.dataManager.newUser(data.user)
                    this.user = new ClientUser(data.user, this)
                    


                    // get DM Channels + users
                    for (let index = 0; index < data.dms.length; index++) {
                        const channel = data.dms[index];
                        if (!channel.recipients) continue;
                        this.dataManager.newUser(channel.recipients[0])
                        this.dataManager.newChannel(channel);
                    }
                    

                    // get servers + channels
                    for (let index = 0; index < data.user.servers.length; index++) {
                        const server = data.user.servers[index];
                        this.guilds.cache.set(server.server_id, new Guild(server, this));
                        for (let index = 0; index < server.channels.length; index++) {
                            const channel = server.channels[index];
                            this.dataManager.newChannel(channel)                 
                        }

                    }

                    // get roles
                    for (let index = 0; index < data.serverRoles.length; index++) {
                        addServerRoles(data.serverRoles[index], this);
                    }

                    // get server users
                    for (let index = 0; index < data.serverMembers.length; index++) {
                        addServerMember(data.serverMembers[index], this);
                    }

                    // get presences
                    for (let index = 0; index < data.memberStatusArr.length; index++) {
                        setMemberPresence(data.memberStatusArr[index], this);
                    }

                    // get activity status
                    for (let index = 0; index < data.customStatusArr.length; index++) {
                        setMemberActivityStatus(data.customStatusArr[index], this)          
                    }

      

                    const readyCB = this.listeners.get(clientEventsNames.ready);
                    if (readyCB) readyCB()
                })
                this.socket.once(AUTHENTICATION_ERROR, (data: string) => {
                    reject(new Error(data));
                    this.socket.off();
                    this.socket.offAny();
                })
                this.socket.on("disconnect", () => {
                    const cb = this.listeners.get(clientEventsNames.error);
                    if (cb) cb(new Error("Connection Lost."))
                    else throw new Error("Connection Lost.")
                    this.socket.off();
                    this.socket.offAny();
                    this.socket.on('connect', connectEvent);
                })
                this.socket.onAny((event, data) => {
                    if(Object.keys(events).includes(event)) {
                        const func: [string, any, any?] = (events as any)[event](data, this)
                        if (!func) { return;}
                        const cb = this.listeners.get(func[0]);
                        if (!cb) return;
                        cb(func[1], typeof func[2] === "function" ? func[2](data, this) : undefined)
                    }
                })
            }
            this.socket.on('connect', connectEvent);
        })
    }

    on<T extends keyof IClientEvents>(type: T, callback: IClientEvents[T]) {
        if (this.listeners.get(type)) return;
        this.listeners.set(type, callback);
    }
    
    off<T extends keyof IClientEvents>(type: T) {
        this.listeners.delete(type);
    }
}

function addServerRoles(role: any, client: Client) {
    const guild = client.guilds.cache.get(role.server_id);
    if (guild) {
        guild.roles.cache.set(role.id, new Role(role, guild))
    }
}

function addServerMember(member: any, client: Client) {
    if (client.guilds.cache.has(member.server_id)) {
        client.guilds.cache.get(member.server_id)?._addMember(member);
    }
}

function setMemberPresence([id, status]: any, client: Client) {
    if (client.users.cache.has(id)) {
        (client.users.cache.get(id) as any).presence.status = PresenceStatusData[parseInt(status)] as PresenceStatus;
    }  
}
function setMemberActivityStatus([id, activity]: any, client: Client) {
    if (client.users.cache.has(id)) {
        (client.users.cache.get(id) as any).presence.activity = activity
    }   
}

const events = {
    [MESSAGE_CREATED]: (data:any, client: Client) => {
        const message = new Message(data.message, client);
        const creator = data.message.creator
        if (message.author) {
            message.author.username = creator.username;
            message.author.avatar = creator.avatar;
            message.author.discriminator = creator.tag;
        }
        return ["message", message]
    },
    [MESSAGE_UPDATED]: (data:any, client: Client) => {
        const message = new Message(data, client);
        const creator = data.creator
        if (message.author) {
            message.author.username = creator.username;
            message.author.avatar = creator.avatar;
            message.author.discriminator = creator.tag;
        }
        return ["updateMessage", message]
    },
    [MESSAGE_DELETED]: (data:any, client: Client) => {
        const message = new Message(data, client);
        return ["deleteMessage", message]
    },
    [USER_STATUS_CHANGED]: (data: {user_id: string, status: any}, client: Client) => {
        const presence = client.users.cache.get(data.user_id)?.presence
        if (presence) {
            presence.status = PresenceStatusData[parseInt(data.status)] as PresenceStatus
            return ["presenceUpdate", presence]
        }
    },
    [USER_CUSTOM_STATUS_CHANGED]: (data: {user_id: string, custom_status: string}, client: Client) => {
        const presence = client.users.cache.get(data.user_id)?.presence
        if (presence) {
            presence.activity = data.custom_status
            return ["presenceUpdate", presence]
        }
    },
    [SERVER_MEMBER_ADDED]: (data: {serverMember: any, custom_status: string, presence: string}, client: Client) => {
        if (client.guilds.cache.has(data.serverMember.server_id)) {
            const clientPresence = client.users.cache.get(data.serverMember.member.id);
            if (clientPresence) {
                if (data.presence) clientPresence.presence.status = PresenceStatusData[parseInt(data.presence)] as PresenceStatus;
                if (data.custom_status) clientPresence.presence.activity = data.custom_status;
            }
            return ["guildMemberAdd", client.guilds.cache.get(data.serverMember.server_id)?._addMember(data.serverMember)];
        }
    },
    [SERVER_MEMBER_REMOVED]: (data: {id: string, server_id: string}, client: Client) => {
        const guild = client.guilds.cache.get(data.server_id);
        const member = guild?.members.get(data.id);
        const memberClone =  Object.assign( Object.create( Object.getPrototypeOf(member)), member)
        guild?.members.delete(data.id);
        return ["guildMemberRemove", memberClone]
    },
    [SERVER_UPDATED]: (data: {name?: string, server_id:string, avatar?: string, default_channel_id?: string}, client: Client) => {
        if (client.guilds.cache.has(data.server_id)) { 
            const guild = client.guilds.cache.get(data.server_id);
            if (data.name) {
                guild!!.name = data.name
            }
            if (data.avatar) {
                guild!!.icon = data.avatar
            }
            if (data.default_channel_id) {
                guild!!._defaultChannelId = data.default_channel_id
            }
            return ["guildUpdate", guild];
        }

    },
    [SERVER_JOINED]: (server: any, client: Client) => {
        const guild = new Guild(server, client);
        client.guilds.cache.set(server.server_id, guild);
        for (let index = 0; index < server.channels.length; index++) {
            const channel = server.channels[index];
            client.dataManager.newChannel(channel, guild)   
        }
        return ["N/A"]              
    },
    [SERVER_LEFT]: (data: any, client: Client) => {
        const guild = client.guilds.cache.get(data.server_id);
        if (guild) {
            client.guilds.cache.delete(data.server_id)
        }
        return ["guildDelete", guild]              
    },
    [MESSAGE_BUTTON_CLICKED]: (data: any, client: Client) => {
        return ["messageButtonClicked", new Button(data, client), buttonDone]              
    },
    [SERVER_ROLE_UPDATED]: (data: any, client: Client) => {
        const guild = client.guilds.cache.get(data.server_id);
        if (!guild) return;
        const role = guild.roles.cache.get(data.id);
        if (!role) return;
        role.permissions = data.permissions || role.permissions;
        role.color = data.color || role.color;
        role.name = data.name || role.name;
        return ["roleUpdate", role];         
    },
    [SERVER_ROLE_CREATED]: (data: any, client: Client) => {
        const guild = client.guilds.cache.get(data.server_id);
        if (!guild) return;
        if (guild.roles.cache.has(data.id)) return;
        const role = new Role(data, guild);
        guild.roles.cache.set(data.id, role);
        return ["roleCreate", role];         
    },
    [SERVER_MEMBERS]: (data: any, client: Client) => {
        const { serverMembers, memberPresences, programActivityArr } = data;
        for (let index = 0; index < serverMembers.length; index++) {
            addServerMember(serverMembers[index], client);
        }
        for (let index = 0; index < memberPresences.length; index++) {
            setMemberPresence(data.memberPresences[index], client);
        }
        for (let index = 0; index < programActivityArr.length; index++) {
            setMemberActivityStatus(programActivityArr[index], client);            
        }

        // guild create is used here since members is a seperate event 
        // and members array would be empty if used properly.
        const guild = client.guilds.cache.get(serverMembers[0].server_id)
        if (guild) {
            return ["guildCreate", guild]
        }
    },
    [SERVER_ROLES]: (data: any, client: Client) => {
        for (let i = 0; i < data.roles.length; i++) {
            addServerRoles(data.roles[i], client);
        }
        return ["N/A"]
    }
}

function buttonDone(data: any, client: Client) {
    return function (message?: any) {
        return client.fetch.messageButtonCallback(data.channelId, data.messageId, data.id, data.clickedById, message)
    }
}