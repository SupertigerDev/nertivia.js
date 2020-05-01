import { User } from "./User";
import { Client } from ".";
import { PresenceStatus, PresenceStatusData } from "./Interfaces/Status";




export default class ClientUser extends User {
    constructor(user: any, client: Client) {
        super(user, client);
        //this.setStatus("idle")
    }
    setStatus(status: PresenceStatus) {
        return this.client.fetch.setStatus(PresenceStatusData.indexOf(status)).then(() => {
            this.presence.status = status;
            return this.presence;
        })

    }

}