
import { Client } from ".";
import Channel from "./Channel";
import Guild from "./Guild";
import { User } from "./User";
export default class Message {
    id: string;
    content: string;
    auther: User;
    channel: Channel | undefined;
    guild: Guild | undefined;
    client: Client;
    constructor(message: any, client: Client) {
        this.id = message.messageID;
        this.content = message.message;
        this.auther = client.users.cache.get(message.creator.uniqueID) as any
        this.channel = client.channels.cache.get(message.channelID);
        this.guild = this.channel?.guild;
        this.client = client;
    }
    send(content:string) {
        return this.channel?.send(content);
    }
    reply(content: string) {
        return this.channel?.send(`<@${this.auther.id}>, ${content}`)
    }
}