
import { Client } from ".";
import Channel from "./Channel";
import Guild from "./Guild";
import { User } from "./User";
import ServerMember from "./ServerMember";
export default class Message {
    id: string;
    content: string;
    author: User;
    channel: Channel | undefined;
    guild: Guild | undefined;
    client: Client;
    member: ServerMember | undefined;
    constructor(message: any, client: Client) {
        this.id = message.messageID;
        this.content = message.message;
        this.author = client.users.cache.get(message.creator.uniqueID) as any
        this.channel = client.channels.cache.get(message.channelID);
        this.guild = this.channel?.guild;
        this.member = this.guild?.members.get(message.creator.uniqueID) as any
        this.client = client;
    }
    send(content:string) {
        return this.channel?.send(content);
    }
    edit(content:string) {
        return this.client.fetch.edit(content, this);
    } 
    reply(content: string) {
        return this.channel?.send(`<@${this.author.id}>, ${content}`)
    }
    delete(delay: number = 0) {
        setTimeout(() => {
            return this.client.fetch.deleteMessage(this.channel!!, this);
        }, delay);
    }
}