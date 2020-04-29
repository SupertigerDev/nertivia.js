import IUser from "./User";

export default interface IAuthenticationData  {
    user: IUser & User
    serverMembers: ServerMembers[]
    dms: DMs[];
}

interface User {
    uniqueID: string
    servers: Servers[]
}
interface Servers {
    name: string
    creator: string
    server_id: string
    avatar?: string
    banner?: string
    channels: Channel[]
}
interface Channel {
    name: string
    channelID: string
    server_id: string
}

interface ServerMembers {
    type: string
    member: IUser & User
}
interface DMs {
    recipients: (IUser & User)[]
}