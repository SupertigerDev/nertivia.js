import { User } from "./User";
import { Client } from ".";

export default class ServerMember {
    user: User;
    client: Client;
    type: string;
    constructor(client: Client, member: any) {
        this.user = member.user;
        this.type = member.type;
        this.client = client;
    }
    toString() {
        return `<@${this.user.id}>`
    }
} 