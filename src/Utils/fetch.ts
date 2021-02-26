import fetch from 'node-fetch';
import { END_POINTS } from '../constants';
import { Client } from '..';
import { User } from '../User';
import Channel from '../Channel';
import Message from '../Message';
import SendOptions from '../Interfaces/SendOptions';
import HTMLEmbedBuilder from '../HTMLEmbedBuilder';
import { JsonInput } from 'jsonhtmlfyer';
import CreateRole from '../Interfaces/CreateRole'
import Guild from '../Guild';
import Role from '../Role';
import { RolePermissionsEnum } from '../constants/RolePermissions';
import { addPerm } from './permissionUtils';


export default class Fetch {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }
    postJSON(method: string, path: string, json?: any): Promise<any>{
        if (!this.client.token) return Promise.reject(new Error("Token not provided."))

        return new Promise((resolve, reject) => {
            fetch(`https://nertivia.net/${path}`, {
            // fetch(`http://localhost/${path}`, {
                method: method,
                headers: {
                    'authorization': this.client.token as string,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            }).then(async res => {
                if (res.ok) {
                    resolve(await res.json())
                } else {
                    reject(await res.json())
                }
            })
            .catch(err => { reject(err)})
        })

    }
    send(content: string, opts: SendOptions, channel: Channel | User) {
        let fetch: Promise<any>;
        if (opts.htmlEmbed && opts.htmlEmbed instanceof HTMLEmbedBuilder) {
            opts.htmlEmbed = (opts.htmlEmbed.obj as JsonInput)
        }
        if (channel instanceof User) {
            fetch = this.client.fetch.createDM(channel).then(chan =>
                this.postJSON("post", END_POINTS.MESSAGES_CHANNELS_PATH + chan.id, {
                    message: content,
                    ...opts
                })
            )
        } else {
            fetch = this.postJSON("post", END_POINTS.MESSAGES_CHANNELS_PATH + channel.id, {
                message: content,
                ...opts
            })
        }
        return fetch.then(data =>
            new Message(data.messageCreated, this.client)
        )
    }
    deleteMessage(channel: Channel, message: Message) {
        return this.postJSON('delete', END_POINTS.MESSAGES_PATH + `${message.id}/channels/${channel.id}`).then(() => {
            return message
        })
    }
    edit(content: string, opts: SendOptions, message: Message) {
        return this.postJSON("patch", `${END_POINTS.MESSAGES + message.id}/channels/${message.channel?.id}`, {
            message: content,
            ...opts
        }).then(data =>
            new Message(data, this.client)
        )
    }
    createDM(recipient: User): Promise<Channel> {
        const channel = this.getExistingDM(recipient);
        if (channel) return Promise.resolve(channel);
        return this.postJSON("post", END_POINTS.CHANNELS_PATH + recipient.id).then(({ channel }) => {
            const newChannel = this.client.dataManager.newChannel(channel)
            if (!newChannel) return Promise.reject(new Error("Failed to add channel."));
            return newChannel
        })
    }
    getExistingDM(user: User) {
        return this.client.channels.cache.find(channel =>
            channel.recipient?.id === user.id
        )
    }
    setStatus(status: number) {
        return this.postJSON("post", `${END_POINTS.SETTINGS}/status`, { status })
    }
    setActivity(content: string) {
        return this.postJSON("post", `${END_POINTS.SETTINGS}/custom-status`, { custom_status: content })
    }
    messageButtonCallback(channelID: string, messageID: string, buttonID: string, clickedByID: string, message?: string) {
        return this.postJSON("patch", `${END_POINTS.CHANNELS_PATH}${channelID}/messages/${messageID}/button/${buttonID}`, { clickedByID, message })
    }
    createRole(opts: CreateRole, guild: Guild) {
        const postData = {
            name: opts.data.name,
            color: opts.data.color,
            permissions: 0,
        };
        // set role permissions
        if (opts.data.permissions?.length) {
            let perms = 0;
            opts.data.permissions.forEach(v => {
               perms =  addPerm(perms, RolePermissionsEnum[v]);
            })
            postData.permissions = perms;
        }
        return this.postJSON('post', `${END_POINTS.SERVERS_PATH}${guild.id}/roles`, postData);        
    }
    updateRole(opts: any, role: Role, guild: Guild) {
        return this.postJSON('patch', `${END_POINTS.SERVERS_PATH}${guild.id}/roles/${role.id}`, opts);        
    }
    kickMember(guild: Guild, id: string) {
        return this.postJSON('delete', `${END_POINTS.SERVERS_PATH}${guild.id}/members/${id}`)
    }
    banMember(guild: Guild, id: string){
        return this.postJSON('put', `${END_POINTS.SERVERS_PATH}${guild.id}/bans/${id}`)
    }
    unbanMember(guild: Guild, id: string) {
        return this.postJSON('delete', `${END_POINTS.SERVERS_PATH}${guild.id}/bans/${id}`)
    }
}