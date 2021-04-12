import IUser from "./User";

export default interface IAuthenticationData  {
    user: IUser & User
    serverMembers: ServerMember[]
    dms: Channel[];
    memberStatusArr: [[string, string]]
    customStatusArr: [[string, string]],
    serverRoles: ServerRoles[]
}
interface ServerRoles {
    name: string,
    permissions: number,
    deletable: boolean,
    id: string,
    server_id: string,
    order: number,
    color: string
}

interface User {
    id: string
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

interface ServerMember {
    type: string
    member: IUser & User
    server_id: string
    roles: string[];
}