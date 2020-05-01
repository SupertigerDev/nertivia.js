import { Client } from ".";
import { PresenceStatus, PresenceStatusData } from "./Interfaces/Status";
import { User } from "./User";

export default class Presence {
    client: Client;
    status: PresenceStatus;
    user: User;
    activity: string | null;
    constructor(status: PresenceStatus | number, activity: string | undefined, user: User, client: Client) {
        this.status = "invisible";
        this.user = user;
        this.client = client;
        this.activity = null

        if (typeof status === "number") {
            this.status = PresenceStatusData[status] as PresenceStatus;
        } else {
            this.status = status;
        }
        if (activity) {
            this.activity = activity;
        }
    }
}