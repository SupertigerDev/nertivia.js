import { RoleType } from "../constants/RolePermissions";

export default interface CreateOpts {
    data: createData,
}
interface createData {
    name?: string,
    color?: string,
    permissions?: RoleType[]
}