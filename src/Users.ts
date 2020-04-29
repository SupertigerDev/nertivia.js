import { Client } from ".";
import { User } from "./User";

export default class Users {
    client: Client;
    cache: Map<string, User>;
    constructor(client: Client) {
        this.client = client;
        this.cache = new Map();
    }

    fetch(id: string, cache?: boolean) {
        console.log("users.fetch not implimented yet.")
    }
}