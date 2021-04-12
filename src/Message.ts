
import { Client } from ".";
import Channel from "./Channel";
import Guild from "./Guild";
import { User } from "./User";
import ServerMember from "./ServerMember";
import MessageMentions from "./MessageMentions";
import SendOptions from "./Interfaces/SendOptions";
export default class Message {
    id: string;
    content?: string;
    author: User;
    channel: Channel | undefined;
    guild: Guild | undefined;
    client: Client;
    member: ServerMember | undefined;
    mentions: MessageMentions;
    constructor(message: any, client: Client) {
        this.id = message.messageID;
        this.content = message.message;
        this.author = client.users.cache.get(message.creator.id) as any
        this.channel = client.channels.cache.get(message.channelID);
        this.guild = this.channel?.guild;
        this.member = this.guild?.members.get(message.creator.id) as any
        this.client = client;
        this.mentions = new MessageMentions(this, this.client)
    }
    send(content:string, options: SendOptions = {}) {
        return this.channel?.send(content, options);
    }
    edit(content:string, options: SendOptions = {}) {
        return this.client.fetch.edit(content, options, this);
    } 
    reply(content: string, options: SendOptions = {}) {
        return this.channel?.send(`<@${this.author.id}>, ${content}`, options)
    }
    delete(delay: number = 0) {
        setTimeout(() => {
            return this.client.fetch.deleteMessage(this.channel!!, this);
        }, delay);
    }
}