import IUser from "./User";

export default interface IAuthenticationData  {
    user: IUser & User
    serverMembers: ServerMembers[]
    dms: Channel[];
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
    server_id?: string
    recipients?: (IUser & User)[]
}

interface ServerMembers {
    type: string
    member: IUser & User
    server_id: string
}