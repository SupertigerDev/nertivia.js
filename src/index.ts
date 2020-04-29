import io from 'socket.io-client';
const socketIOWildcard = require('socketio-wildcard')(io.Manager);

import { User } from './User';
import IAuthenticationData from './Interfaces/AuthenticationData';
import {IClientEvents, clientEventsNames} from './Interfaces/ClientEvents';
import Message from './Message';
import Channel from './Channel';

export class Client {
    token: string | null;
    user: User | null;
    listeners: Map<keyof IClientEvents | any, any>;
    socket: SocketIOClient.Socket;
    users: Map<string, User>;
    channels: Map<string, Channel>;
    constructor() {
        this.token = null;
        this.user = null;
        this.listeners = new Map();
        this.socket = io('https://nertivia.supertiger.tk', { autoConnect: false });
        this.users = new Map<string, User>();
        this.channels = new Map<string, Channel>();
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
                    this.user = new User({
                        username: data.user.username,
                        tag: data.user.tag,
                        avatar: data.user.avatar,
                        id: data.user.uniqueID
                    })
                    this.users.set(this.user.id, this.user);

                    // get users
                    for (let index = 0; index < data.serverMembers.length; index++) {
                        const member = data.serverMembers[index].member;
                        this.users.set(member.uniqueID, new User(member))
                    }

                    for (let index = 0; index < data.dms.length; index++) {
                        const member = data.dms[index].recipients[0];
                        this.users.set(member.uniqueID, new User(member))
                    }

                    // get channels
                    for (let index = 0; index < data.user.servers.length; index++) {
                        const servers = data.user.servers[index];
                        for (let index = 0; index < servers.channels.length; index++) {
                            const channel = servers.channels[index];
                            this.channels.set(channel.channelID, new Channel(channel, this));                            
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