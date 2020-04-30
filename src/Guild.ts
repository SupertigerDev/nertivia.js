import { Client } from ".";
import Collection from "@discordjs/collection";
import Channel from './Channel'
import ServerMember from './ServerMember'

export default class Guild {
    id: string;
    client: Client;
    name: string;
    channels: Collection<string, Channel>;
    members: Collection<string, ServerMember>;
    constructor(server: any, client: Client) {
        this.id = server.server_id
        this.name = server.name
        this.channels = new Collection()
        this.members = new Collection()
        this.client = client
    }

    _addMember(data: any) {
        const user = this.client.dataManager.newUser(data.member);
        if (!user) return;
        this.members.set(user.id, new ServerMember(this.client, {...data, user}));
    }


}