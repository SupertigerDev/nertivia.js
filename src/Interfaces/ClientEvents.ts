import Message from "../Message";
import Presence from "../Presence";
import { User } from "../User";
import ServerMember from "../ServerMember";
import Guild from "../Guild";
import MessageButton from "./MessageButton";
import Role from "../Role";
import Button from "../Button";
import { MESSAGE_BUTTON_CLICKED, MESSAGE_CREATED, MESSAGE_DELETED, MESSAGE_UPDATED, SERVER_JOINED, SERVER_LEFT, SERVER_MEMBER_ADDED, SERVER_MEMBER_REMOVED, SERVER_ROLE_CREATED, SERVER_ROLE_UPDATED, SERVER_UPDATED, USER_STATUS_CHANGED } from "../ServerEventNames";

export interface IClientEvents {
    ready?: () => void
    message: (message:Message) => void
    updateMessage: (message:Message) => void
    deleteMessage: (message:Message) => void
    presenceUpdate: (presence: Presence) => void
    guildMemberAdd: (serverMember: ServerMember) => void
    guildMemberRemove: (serverMember: ServerMember) => void
    guildCreate: (guild: Guild) => void
    error: (error: Error) => void
    messageButtonClicked: (Button: Button, done: (message?: string) => Promise<any>) => void
    roleUpdate: (role: Role) => void
    roleCreate: (role: Role) => void
    guildDelete: (guild: Guild) => void
    guildUpdate: (guild: Guild) => void
}

export const clientEventsNames = {
    ready: "ready",
    message : MESSAGE_CREATED,
    updateMessage : MESSAGE_UPDATED,
    deleteMessage : MESSAGE_DELETED,
    presenceUpdate: USER_STATUS_CHANGED,
    guildMemberAdd: SERVER_MEMBER_ADDED,
    guildMemberRemove: SERVER_MEMBER_REMOVED,
    guildCreate: SERVER_JOINED,
    messageButtonClicked: MESSAGE_BUTTON_CLICKED,
    error: "error",
    roleUpdate: SERVER_ROLE_UPDATED,
    roleCreate: SERVER_ROLE_CREATED,
    guildDelete: SERVER_LEFT,
    guildUpdate: SERVER_UPDATED
}
