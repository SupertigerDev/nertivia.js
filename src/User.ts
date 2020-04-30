import { Client } from "."

export class User {
    username: string
    tag: string
    avatar: string
    id: string
    discriminator: string
    client: Client
    constructor(user: any, client: Client) {
        this.username = user.username
        this.tag = `${user.username}:${user.tag}`
        this.avatar = user.avatar
        this.id = user.uniqueID
        this.discriminator = user.tag
        this.client = client;
    }
    toString() {
        return `<@${this.id}>`
    }
    createDM() {

    }
    send() {

    }
}