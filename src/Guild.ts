import { Client } from ".";

export default class Guild {
    id: string;
    client: Client;
    name: string;
    constructor(server: any, client: Client) {
        this.id = server.server_id
        this.name = server.name
        this.client = client
    }


}