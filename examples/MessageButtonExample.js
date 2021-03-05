const Nertivia = require("../dist");
const client = new Nertivia.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})


client.on("messageButtonClicked", (button, done) => {
    if (button.id === "hug-me") {
        button.channel.send(`**hugs** ${button.clickedUser}`)
        done();
    }

    if (button.id === "kick-me") {
        button.channel.send(`${button.clickedUser} has been kicked (Not really)`, {
            buttons: [{ id: 'unban', name: "undo" }]
        })
        done();
    }
    if (button.id === "unban") {
        done("Action not implimented!")
    }
})



client.on("message", msg => {
    if (msg.content === "!actions") {
        msg.reply("Click on the actions below", {
            buttons: [
                {
                    id: "hug-me",
                    name: "Hug"
                },
                {
                    id: 'kick-me',
                    name: 'Kick'
                },
            ]
        })
    }
})

client.login("token")