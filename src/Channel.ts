import { postJSON } from "./Utils/fetch";
import { Client } from ".";
import { MESSAGES_CHANNELS_PATH } from "./constants";

export default class Channel {
    id: string;
    client: Client;
    constructor(channel: any, client: Client) {
        this.id = channel.channelID
        this.client = client
    }
    send(content:string) {
        return postJSON(this.client.token || "null", MESSAGES_CHANNELS_PATH + this.id, {
            message: content
        })
    }

}