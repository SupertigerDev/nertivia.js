export default interface MessageButton {
    id: string,
    channelID: string,
    messageID: string,
    clickedByID: string,
    serverID?: string,
}