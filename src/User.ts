import IUser from './Interfaces/User';

export class User {
    username: string
    tag: string
    avatar: string
    id: string
    discriminator: string
    constructor(user: any) {
        this.username = user.username
        this.tag = `${user.username}:${user.tag}`
        this.avatar = user.avatar
        this.id = user.uniqueID
        this.discriminator = user.tag
    }
}