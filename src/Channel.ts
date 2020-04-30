import { Client } from ".";
import Guild from './Guild'
import { User } from "./User";

export default class Channel {
    id: string;
    name: string | undefined;
    guild: Guild | undefined
    recipient: User | undefined;
    client: Client;
    constructor(channel: any, client: Client) {
        this.name = channel.name
        this.id = channel.channelID
        this.guild = client.guilds.cache.get(channel.server_id);
        this.client = client
        this.recipient = undefined
        if (channel.recipients && channel.recipients.length) {
            this.recipient = this.client.users.cache.get(channel.recipients[0].uniqueID)
        }
    }
    send(content:string) {
        return this.client.fetch.send(content, this);
    }
    toString() {
        return `<#${this.id}>`
    }

}