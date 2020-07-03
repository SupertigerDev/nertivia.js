import {JsonInput} from 'jsonhtmlfyer'
export default interface SendOptions {
    /**
     * Add buttons to your message 👉
     */
    buttons?: Button[],
    /**
     * Add a cool lookin' HTML Embed 🌟
     */
    htmlEmbed?: JsonInput
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