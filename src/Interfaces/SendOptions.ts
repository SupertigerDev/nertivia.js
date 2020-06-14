export default interface SendOptions {
    /**
     * Add buttons to your message 👉
     */
    buttons?: Button[]
}


interface Button {
    /**
     * id is used to target a button when an event is fired.
     */
    id: string
    /**
     * Name of the button 🤯
     */
    name: string,
}