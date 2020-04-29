import { Client } from ".";
import Channel from "./Channel";

export default class Channels {
    client: Client;
    cache: Map<string, Channel>;
    constructor(client: Client) {
        this.client = client;
        this.cache = new Map();
    }

    fetch(id: string, cache?: boolean) {
        console.log("channels.fetch not implimented yet.")
    }
}