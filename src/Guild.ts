import { Client } from ".";
import Collection from "@discordjs/collection";
import Channel from './Channel'
import ServerMember from './ServerMember'
import { END_POINTS } from "./constants";
import RolesManager from "./GuildRolesManager";

export default class Guild {
    id: string;
    client: Client;
    name: string;
    channels: Collection<string, Channel>;
    members: Collection<string, ServerMember>;
    icon: string;
    roles: RolesManager;
    constructor(server: any, client: Client) {
        this.id = server.server_id
        this.name = server.name
        this.icon = server.avatar
        this.channels = new Collection()
        this.members = new Collection()
        this.client = client
        this.roles = new RolesManager(this);
    }
    get iconURL(): string {
        return END_POINTS.NERTIVIA_CDN + this.icon;
    }

    kick(id: string) {
        return this.client.fetch.kickMember(this, id);
    }
    ban(id: string) {
        return this.client.fetch.banMember(this, id);
    }
    unban(id: string) {
        return this.client.fetch.unbanMember(this, id);
    }

    _addMember(data: any) {
        const user = this.client.dataManager.newUser(data.member);
        if (!user) return;
        const sm = new ServerMember(this.client, this, { ...data, user });
        this.members.set(user.id, sm);
        return sm;
    }

}