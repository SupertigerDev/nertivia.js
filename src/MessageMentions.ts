
import Collection from "@discordjs/collection";
import ServerMember from "./ServerMember";
import { User } from "./User";
import Message from "./Message";
import { Client } from ".";

export default class MessageMentions {
    members: Collection<string, ServerMember>;
    users: Collection<string, User>;
    constructor(message: Message, client: Client) {
        this.members = new Collection();
        this.users = new Collection();

        if (!message.content) return;
        const reg = /<@([\d]+)>/g
        const result = message.content.match(reg);
        if (!result) return;
        for (let index = 0; index < result.length; index++) {
            let id = result[index];
            id = id.slice(2, id.length - 1)
            if (client.users.cache.has(id)) {
                this.users.set(id, (client.users.cache.get(id) as User))
            }
            if (message.guild && message.guild.members.get(id)) {
                this.members.set(id, (message.guild.members.get(id) as ServerMember))
            }
        }

    }
}