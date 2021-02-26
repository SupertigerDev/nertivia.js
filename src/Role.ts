import Guild from "./Guild";
import { Client } from '.'
import IRolePermissions from "./Interfaces/IRolePermissions";
import {RolePermissionsEnum, RoleType} from "./constants/RolePermissions";
export default class GuildRole {
    guild: Guild;
    client: Client;
    color: string;
    order: number;
    id: string;
    permissions: number;
    name: string;
    constructor(role: any, guild: Guild) {
        this.client = guild.client;
        this.guild = guild;

        this.name = role.name;
        this.permissions = role.permissions;
        this.id = role.id;
        this.order = role.order;
        this.color = role.color
    }
    setPermissions(newPerms: IRolePermissions) {
        let perms = this.permissions;
        const addPerm = (flag: number) => perms |= flag;
        const removePerm = (flag: number) => perms &= ~flag;
        const newPermsKeys = Object.keys(newPerms);
        for (let index = 0; index < newPermsKeys.length; index++) {
            const permName: RoleType = newPermsKeys[index] as any;
            let status = newPerms       
            let flag = RolePermissionsEnum[permName];
            
            if (status) addPerm(flag)
            else removePerm(flag);
        }
        return this.client.fetch.updateRole({permissions: perms}, this, this.guild).then(() => {
            this.permissions = perms;
            return this;
        })

    }
}