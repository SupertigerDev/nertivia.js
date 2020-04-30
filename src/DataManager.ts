import { Client } from ".";
import Guild from "./Guild";
import Channel from "./Channel";
import { User } from "./User";

export default class DataManager {
    client: Client
    constructor(client: Client) {
        this.client = client;
    }
    newChannel(data: any, guild?: Guild) {
        const channel = new Channel(data, this.client);
        if (data.server_id) {
            guild = guild || this.client.guilds.cache.get(data.server_id);
            if (!guild) return;
            guild.channels.set(data.channelID, channel)
        }

        if (channel) {
           this.client.channels.cache.set(channel.id, channel);
           return channel
        } else {
            return undefined;
        }
    }
    newUser(data: any) {
        if (this.client.users.cache.has(data.uniqueID)) return this.client.users.cache.get(data.uniqueID);
        const user = new User(data, this.client);
        this.client.users.cache.set(user.id, user);
        return user;
    }

}