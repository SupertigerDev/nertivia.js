import { Client } from ".";
import Guild from "./Guild";
import Collection from "@discordjs/collection";

export default class Guilds {
    client: Client;
    cache: Collection<string, Guild>;
    constructor(client: Client) {
        this.client = client;
        this.cache = new Collection();
    }

    fetch(id: string, cache?: boolean) {
        console.log("guilds.fetch not implimented yet.")
    }
}