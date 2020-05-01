import io from 'socket.io-client';
const socketIOWildcard = require('socketio-wildcard')(io.Manager);

import { User } from './User';
import IAuthenticationData from './Interfaces/AuthenticationData';
import {IClientEvents, clientEventsNames} from './Interfaces/ClientEvents';
import Message from './Message';
import Channel from './Channel';
import Users from './Users';
import Channels from './Channels';
import Guilds from './Guilds';
import Guild from './Guild';
import Fetch from './Utils/fetch';
import DataManager from './DataManager';
import ClientUser from './ClientUser';
import { PresenceStatusData, PresenceStatus } from './Interfaces/Status';

export class Client {
    token: string | null;
    user: ClientUser | undefined;
    listeners: Map<keyof IClientEvents | any, any>;
    socket: SocketIOClient.Socket;
    users: Users;
    channels: Channels;
    guilds: Guilds;
    fetch: Fetch;
    dataManager: DataManager;
    constructor() {
        this.token = null;
        this.user = undefined;
        this.listeners = new Map();
        this.socket = io('https://nertivia.supertiger.tk', { autoConnect: false });
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
            socketIOWildcard(this.socket)
            this.socket.once('connect', () => {
                this.socket.emit('authentication', {token})
                this.socket.once('success', (data: IAuthenticationData) => {
                    this.socket.off('auth_err')
                    resolve('Connected')
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

                    // get server users
                    for (let index = 0; index < data.serverMembers.length; index++) {
                        const member = data.serverMembers[index];
                        if (this.guilds.cache.has(member.server_id)) {
                            this.guilds.cache.get(member.server_id)?._addMember(member);
                        }
                    }

                    // get presences
                    for (let index = 0; index < data.memberStatusArr.length; index++) {
                        const [id, status] = data.memberStatusArr[index];
                        if (this.users.cache.has(id)) {
                            (this.users.cache.get(id) as any).presence.status = PresenceStatusData[parseInt(status)] as PresenceStatus;
                        }                        
                    }

                    const readyCB = this.listeners.get(clientEventsNames.ready);
                    if (readyCB) readyCB()
                    resolve("Success.")
                })
                this.socket.once("auth_err", (data: string) => {
                    reject(new Error(data));
                    this.socket.removeAllListeners();
                })
                this.socket.on('*', (res:any) => {
                    const [event, data]: [any, any] = res.data;
                    if(Object.keys(events).includes(event)) {
                        const func: [string, any] = (events as any)[event](data, this)
                        const cb = this.listeners.get(func[0]);
                        if (!cb) return;
                        cb(func[1])
                    }
                })
            })
        })
    }

    on<T extends keyof IClientEvents>(type: T, callback: (arg: IClientEvents[T]) => void) {
        if (this.listeners.get(type)) return;
        this.listeners.set(type, callback);
    }
    
    off<T extends keyof IClientEvents>(type: T) {
        this.listeners.delete(type);
    }
}

const events = {
    receiveMessage: (data:any, client: Client) => {
        return ["message", new Message(data.message, client)]
    }
}