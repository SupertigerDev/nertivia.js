import { Client } from ".";
import Collection from "@discordjs/collection";

export default class Guild {
    id: string;
    client: Client;
    name: string;
    channels: Collection<string, import("d:/Coding/NodeJS Projects/Nertivia/nertivia.js/src/Channel").default>;
    constructor(server: any, client: Client) {
        this.id = server.server_id
        this.name = server.name
        this.client = client
        this.channels = this.client.channels.cache.filter(channel => 
            channel.guild?.id === this.id
        )
    }


}