import fetch from 'node-fetch';
import { END_POINTS } from '../constants';
import { Client } from '..';
import { User } from '../User';
import Channel from '../Channel';



export default class Fetch {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }
    postJSON(method: string, path: string, json?: any) {
        if (!this.client.token) return Promise.reject(new Error("Token not provided."))
        return fetch(`https://supertiger.tk/${path}`, {
            method: method,
            headers: {
                'authorization': this.client.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        }).then(res => res.json())
    }

    send(content: string, channel: Channel | User) {
        if (channel instanceof User) {
            return this.client.fetch.createDM(channel).then(chan =>
                this.postJSON("post", END_POINTS.MESSAGES_CHANNELS_PATH + chan.id, {
                    message: content
                })
            )
        } else {
            return this.postJSON("post", END_POINTS.MESSAGES_CHANNELS_PATH + channel.id, {
                message: content
            })
        }
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
}