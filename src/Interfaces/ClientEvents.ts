import Message from "../Message";

export interface IClientEvents {
    ready?: any;
    message: Message
}

export enum clientEventsNames {
    ready  = "ready",
    message  = "receiveMessage",
}
