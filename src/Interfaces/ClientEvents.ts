import Message from "../Message";
import Presence from "../Presence";

export interface IClientEvents {
    ready?: any;
    message: Message
    presenceUpdate: Presence
}

export enum clientEventsNames {
    ready  = "ready",
    message  = "receiveMessage",
    presenceUpdate = "userStatusChange"
}
