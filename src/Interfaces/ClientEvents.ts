import Message from "../Message";
import Presence from "../Presence";
import { User } from "../User";
import ServerMember from "../ServerMember";
import Guild from "../Guild";
import MessageButton from "./MessageButton";
import Role from "../Role";

export interface IClientEvents {
    ready?: () => {};
    message: (message:Message) => {}
    presenceUpdate: (presence: Presence) => {}
    guildMemberAdd: (serverMember: ServerMember) => {}
    guildMemberRemove: (serverMember: ServerMember) => {}
    guildCreate: (guild: Guild) => {}
    error: (error: Error) => {}
    messageButtonClicked: (Button: MessageButton, done: (message?: string) => Promise<any>) => {}
    roleUpdate: (role: Role) => {}
    roleCreate: (role: Role) => {}
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
    roleCreate = "server:create_role"
}
