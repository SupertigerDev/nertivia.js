import {postJSON} from "./Utils/fetch";
import {MESSAGES_CHANNELS_PATH} from "./constants";
import { Client } from ".";
import Channel from "./Channel";
import { User } from "./User";
export default class Message {
    content: string;
    id: string;
    client: Client;
    channel: Channel;
    auther: User;
    constructor(message: any, client: Client) {
        this.channel = new Channel({channelID: message.channelID}, client);
        this.auther = client.users.cache.get(message.creator.uniqueID) as any
        this.content = message.message;
        this.id = message.messageID;
        this.client = client;
    }
    send(content:string) {
        return this.channel.send(content);
    }
    reply(content: string) {
        return this.channel.send(`<@${this.auther.id}>, ${content}`)
    }
}