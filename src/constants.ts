export const END_POINTS = {
    CHANNELS_PATH: "api/channels/",
    SERVERS_PATH: "api/servers/",
    openDMChannel: (userId: string) => `api/channels/users/${userId}`,
    messages: (channelId: string) => `api/channels/${channelId}/messages`,
    message: (channelId: string, messageId: string) => `api/channels/${channelId}/messages/${messageId}`,
    SETTINGS: "api/settings/",
    NERTIVIA_CDN: "https://media.nertivia.net/"

} 
