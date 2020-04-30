import { Client } from ".";
import Guild from "./Guild";
import Channel from "./Channel";

export default class DataManager {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }
    newChannel(data: any, guild?: Guild) {
        let channel: Channel | undefined;
        if (data.server_id) {
            guild = guild || this.client.guilds.cache.get(data.server_id);
            if (!guild) return;
            channel = new Channel(data, this.client);
            guild.channels.set(data.channelID, channel)
        }

        if (channel) {
           this.client.channels.cache.set(data.channelID, channel);
           return channel
        } else {
            return undefined;
        }
    }
}