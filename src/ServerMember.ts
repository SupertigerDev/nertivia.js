import { User } from "./User";
import { Client } from ".";
import Guild from "./Guild";
import MemberRolesManager from "./MemberRolesManager";

export default class ServerMember {
    user: User;
    client: Client;
    type: string;
    guild: Guild;
    roles: MemberRolesManager;
    constructor(client: Client, guild: Guild, member: any) {
        this.guild = guild;
        this.user = member.user;
        this.type = member.type;
        this.client = client;
        this.roles = new MemberRolesManager(this.guild, this, member.roles);
    }
    toString() {
        return `<@${this.user.id}>`
    }
    kick() {
        return this.client.fetch.kickMember(this.guild, this.user.id);
    }
    ban() {
        return this.client.fetch.banMember(this.guild, this.user.id);
    }
} 