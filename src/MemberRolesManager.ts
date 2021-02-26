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
    // cache: Collection<string, Role>;
    constructor(_guild: Guild, _member: ServerMember) {
        this.guild = _guild
        this.member = _member
        this.client = this.guild.client
        // this.cache = new Collection()
    }
    add(role: Role) {

    }
    remove(role: Role) {

    }

}