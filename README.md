# nertivia.js
NodeJS library for Nertivia API

# Notice
This library is in its early stages. A lot of features are missing. If you find any issues, make sure you post them in the issues page in GitHub.

## How to get Token
Since bot users are not a thing right now, you can self bot.
Make sure you do not make spam bots, ty :)

To get your token:
1. Open inspect element (`ctrl shift + i)
2. Go to the `console` tab
3. type in `localStorage.getItem("hauthid")`
Your token should print out.


## Usage

NPM package coming soon!

```js
const Nertivia = require("nertivia.js");
const client = new Nertivia.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})


client.on("message", msg => {
    if (msg.content === "ping") {
        msg.reply("pong!")
    }
})

client.login("token")
```
