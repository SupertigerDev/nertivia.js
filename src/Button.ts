import { Client } from ".";
import Channel from "./Channel";
import Guild from "./Guild";
import ServerMember from "./ServerMember";

export default class Button {
    id: string;
    guild: Guild | undefined;
    channel: Channel | undefined
    messageID: string;
    clickedUser: ServerMember | undefined;
    client: Client;
    constructor(button: any, client: Client) {
        this.id = button.id;
        this.guild = client.guilds.cache.get(button.serverID);
        this.clickedUser = this.guild?.members.get(button.clickedByID);
        this.channel = this.guild?.channels.get(button.channelId)
        this.messageID = button.messageID
        this.client = client;
    }
}