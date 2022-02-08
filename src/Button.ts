import { Client } from ".";
import Channel from "./Channel";
import Guild from "./Guild";
import ServerMember from "./ServerMember";

export default class Button {
    id: string;
    guild: Guild | undefined;
    channel: Channel | undefined
    messageId: string;
    clickedUser: ServerMember | undefined;
    client: Client;
    constructor(button: any, client: Client) {
        this.id = button.id;
        this.guild = client.guilds.cache.get(button.serverId);
        this.clickedUser = this.guild?.members.get(button.clickedById);
        this.channel = this.guild?.channels.get(button.channelId)
        this.messageId = button.messageId
        this.client = client;
    }
}