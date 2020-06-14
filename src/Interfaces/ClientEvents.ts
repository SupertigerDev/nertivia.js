import Message from "../Message";
import Presence from "../Presence";
import { User } from "../User";
import ServerMember from "../ServerMember";
import Guild from "../Guild";
import MessageButton from "./MessageButton";

export interface IClientEvents {
    ready?: () => {};
    message: (message:Message) => {}
    presenceUpdate: (presence: Presence) => {}
    guildMemberAdd: (serverMember: ServerMember) => {}
    guildMemberRemove: (serverMember: ServerMember) => {}
    guildCreate: (guild: Guild) => {}
    messageButtonClicked: (Button: MessageButton, done: (message?: string) => Promise<any>) => {}
}

export enum clientEventsNames {
    ready  = "ready",
    message  = "receiveMessage",
    presenceUpdate = "userStatusChange",
    guildMemberAdd = "server:member_add",
    guildMemberRemove = "server:member_remove",
    guildCreate = "server:joined",
    messageButtonClicked = "message_button_clicked"
}
