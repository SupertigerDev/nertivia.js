import { Client } from ".";
import { PresenceStatus, PresenceStatusData } from "./Interfaces/Status";
import { User } from "./User";

export default class Presence {
    client: Client;
    status: PresenceStatus;
    user: User;
    constructor(status: PresenceStatus | number, user: User, client: Client) {
        this.status = "invisible";
        this.user = user;
        this.client = client;

        if (typeof status ===  "number") {
            this.status = PresenceStatusData[status] as PresenceStatus;
        } else {
            this.status = status;
        }
    }
}