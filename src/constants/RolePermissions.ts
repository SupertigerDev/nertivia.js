export enum RolePermissionsEnum {
    ADMIN = 1,
    SEND_MESSAGES = 2,
    MANAGE_ROLES = 4,
    MANAGE_CHANNELS = 8,
    KICK_USER = 16,
    BAN_USER = 32,
}
export type RoleType = "ADMIN" | "SEND_MESSAGES" | "MANAGE_ROLES" | "MANAGE_CHANNELS" | "KICK_USER" | "BAN_USER"