import Message from "../Message";
import Presence from "../Presence";
import { User } from "../User";
import ServerMember from "../ServerMember";
import Guild from "../Guild";
import MessageButton from "./MessageButton";
import Role from "../Role";

export interface IClientEvents {
    ready?: () => void
    message: (message:Message) => void
    presenceUpdate: (presence: Presence) => void
    guildMemberAdd: (serverMember: ServerMember) => void
    guildMemberRemove: (serverMember: ServerMember) => void
    guildCreate: (guild: Guild) => void
    error: (error: Error) => void
    messageButtonClicked: (Button: MessageButton, done: (message?: string) => Promise<any>) => void
    roleUpdate: (role: Role) => void
    roleCreate: (role: Role) => void
    guildDelete: (guild: Guild) => void
}

export enum clientEventsNames {
    ready  = "ready",
    message  = "receiveMessage",
    presenceUpdate = "userStatusChange",
    guildMemberAdd = "server:member_add",
    guildMemberRemove = "server:member_remove",
    guildCreate = "server:joined",
    messageButtonClicked = "message_button_clicked",
    error = "error",
    roleUpdate = "server:update_role",
    roleCreate = "server:create_role",
    guildDelete = "server:leave"
}
