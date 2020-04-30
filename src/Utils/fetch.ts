import fetch from 'node-fetch';
import { MESSAGES_CHANNELS_PATH } from '../constants';
import { Client } from '..';
import { User } from '../User';
import Channel from '../Channel';



export default class Fetch {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }
    postJSON(path: string, json: any) {
        if (!this.client.token) return;
        return fetch(`https://supertiger.tk/${path}`, {
            method: "post",
            headers: {
                'authorization': this.client.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
    }

    send(content: string, channel: Channel | User) {
        if (channel instanceof User) {

        } else {
            return this.postJSON(MESSAGES_CHANNELS_PATH + channel.id, {
                message: content
            })
        }
    }
    getExistingDM(user: User) {
        return this.client.channels.cache.find(channel =>
            channel.recipient?.id === user.id
        )
    }
    createDM(recipient: User) {
        const channel = this.getExistingDM(recipient);
    }
}