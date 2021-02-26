import Guild from "./Guild";
import {Client} from "."
import CreateRole from './Interfaces/CreateRole'
import Collection from "@discordjs/collection";
import Role from "./Role";
import ServerMember from "./ServerMember";
export default class MemberRolesManager{
    guild: Guild;
    client: Client
    member: ServerMember;
    private _roleIdArr: string[] | undefined;
    constructor(_guild: Guild, _member: ServerMember, roles?: string[]) {
        this.guild = _guild
        this.member = _member
        this.client = this.guild.client
        this._roleIdArr = roles; 
    }
    get cache() {
        return this.guild.roles.cache.filter(r => this._roleIdArr?.includes(r.id) || false);
    }
    add(role: Role) {
        return this.client.fetch.addRoleToMember(this.guild, this.member, role).then(() => {
            if (this.cache.has(role.id)) return this.member;
            this._roleIdArr?.push(role.id)
            return this.member;
        });
    }
    remove(role: Role) {
        return this.client.fetch.removeRoleFromMember(this.guild, this.member, role).then(() => {
            if (!this.cache.has(role.id)) return this.member;
            this._roleIdArr = this._roleIdArr?.filter(id => id !== role.id)
            return this.member;
        });
    }

}