import { Client } from "."
import { PresenceStatus, PresenceStatusData } from "./Interfaces/Status"
import Presence from "./Presence"


export class User {
    username: string
    tag: string
    avatar: string
    id: string
    discriminator: string
    client: Client
    presence: Presence
    constructor(user: any, client: Client) {
        this.username = user.username
        this.tag = `${user.username}:${user.tag}`
        this.avatar = user.avatar
        this.id = user.uniqueID
        this.discriminator = user.tag
        this.client = client;
        this.presence = new Presence("invisible", this, this.client);

        if (user.status) {
            this.presence.status = user.status
        }
    }
    toString() {
        return `<@${this.id}>`
    }
    send(content: string) {
        this.client.fetch.send(content, this);
    }
}