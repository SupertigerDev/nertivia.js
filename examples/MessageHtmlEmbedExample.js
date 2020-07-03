const Nertivia = require("../dist");
const client = new Nertivia.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})


client.on("message", msg => {
    if (msg.content === "!embed") {
        msg.send("Hello:", {
            htmlEmbed: {
                tag: "div",
                content: [
                    {tag: "span", content: "Check out my epic website at "},
                    {tag: "a", attributes: {href: "https://nertivia.tk"}, content: "https://nertivia.tk"},
                    {tag: "img", attributes: {src: "https://nertivia.supertiger.tk/img/Graphic.31411f05.webp"}, styles: {height: "100px", width: "auto"}}
                ]
            }
        }).catch(e => {
            console.log(e)
        })
    }
})

client.login("NjY2NTI1NDQ0NzE4NDA4OTA4OC05.qK7BFebdVtslqKHtW-FHK-wv2CVkFjO8rdWIFvcb8mI")