import Message from "../Message";
import Presence from "../Presence";
import { User } from "../User";
import ServerMember from "../ServerMember";

export interface IClientEvents {
    ready?: any;
    message: Message
    presenceUpdate: Presence
    guildMemberAdd: ServerMember
    guildMemberRemove: ServerMember
}

export enum clientEventsNames {
    ready  = "ready",
    message  = "receiveMessage",
    presenceUpdate = "userStatusChange",
    guildMemberAdd = "server:member_add",
    guildMemberRemove = "server:member_remove"
}
