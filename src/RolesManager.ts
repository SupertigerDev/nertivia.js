import Guild from "./Guild";
import {Client} from "."
import CreateRole from './Interfaces/CreateRole'
import Collection from "@discordjs/collection";
import Role from "./Role";
export default class RolesManager{
    guild: Guild;
    client: Client
    cache: Collection<string, Role>;
    constructor(_guild: Guild) {
        this.guild = _guild
        this.client = this.guild.client
        this.cache = new Collection()
    }
    create(opts: CreateRole) {
        return this.client.fetch.createRole(opts, this.guild).then(res => {
            const role = new Role(res, this.guild)
            this.guild.roles.cache.set(res.id, role);
            return role;
        })
    }
}