import {JsonInput} from 'jsonhtmlfyer'

interface Opts {
    direction: Direction
}

type Direction = "column" | "row"

export default class HTMLEmbedBuilder {
    obj: JsonInput | any
    direction: Direction
    constructor(options: Opts) {
        this.direction = options ? options.direction : "row"
        this.obj = {
            tag: "div",
            styles: {
                display: "flex",
                flexDirection: this.direction
            },
            content: [],
        }
    }
    setBackgroundImage(url: string) {
        this.obj.styles["backgroundImage"] = url;
        this.obj.styles["backgroundSize"] = "100%";
        this.obj.styles["backgroundPosition"] = "center";
        return this;
    }

    addAvatar(url: string, text?: string, direction?: Direction) {
        let content: any = [
            {
                tag: 'img', 
                attributes: {src: url},
                styles: {
                    borderRadius: "50%",
                    height: "30px",
                    marginRight: "5px",
                    width: "30px",
                }
            },
        ]

        if (text) {
            content.push({
                tag: "span",
                content: text
            })
        }
        ((this.obj as JsonInput).content as JsonInput[] | any).push({
            tag: "div",
            styles: {
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                flexDirection: direction || "row"
            },
            content
            
        })
        return this;
    }
    addText(text: string) {
        this.obj.content.push({
            tag: 'div',
            content: text
        })
        return this;
    }

}