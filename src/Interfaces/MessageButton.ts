export default interface MessageButton {
    id: string,
    channelId: string,
    messageID: string,
    clickedByID: string,
    serverID?: string,
}