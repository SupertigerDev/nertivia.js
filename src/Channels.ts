import { Client } from ".";
import Channel from "./Channel";
import Collection from '@discordjs/collection';
export default class Channels {
    client: Client;
    cache: Collection<string, Channel>;
    constructor(client: Client) {
        this.client = client;
        this.cache = new Collection();
    }

    fetch(id: string, cache?: boolean) {
        console.log("channels.fetch not implimented yet.")
    }
}