import { User } from "./User";
import { Client } from ".";
import { PresenceStatus, PresenceStatusData } from "./Interfaces/Status";




export default class ClientUser extends User {
    constructor(user: any, client: Client) {
        super(user, client);
    }
    setStatus(status: PresenceStatus) {
        return this.client.fetch.setStatus(PresenceStatusData.indexOf(status)).then(() => {
            this.presence.status = status;
            return this.presence;
        })
    }

    //setActivity({ action: "Exploring", name: "Nertivia" })
    //setActivity("Bree")
    setActivity(content: string) {
        return this.client.fetch.setActivity(content).then(() => {
            this.presence.activity = content;
            return this.presence;
        })
    }

}