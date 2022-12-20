# FdlCordBot

This project is about my discord bot I created to get antonyms and synonyms of words

[Demo of app](https://www.google.com/)


## Project structure
Below is a basic overview of the project structure:

```

├── .env.sample -> sample .env file
├── app.js      -> main entrypoint for app
├── commands.js -> slash command payloads 
├── utils.js    -> utility functions and enums
├── openai.js    -> utility functions to communicate with openai API
├── package.json
├── README.md
└── .gitignore
```

## .env file

I need to store somme credentials about the discord app & my openai API key.

The file look like this : 

```
APP_ID=
GUILD_ID=
DISCORD_TOKEN=
PUBLIC_KEY=

OPENAI_API_KEY=

```

## app.js

In this file I set up all services exported in other files & I put them together.

At the startup of the application,with HasGuildCommands I verify if commands : ANTONYMOUS_COMMAND & SYNONYMOUS_COMMAND are installed.If not,they are installed.

The app use a middleware to verify each incoming request & assert that it is a valid request coming from Discord

```
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

```

On my discord developers dashboard I set up the interaction URL to receive all interactions between my bot & users as webhooks.This URL is that 
/interactions .Requests comes via POST & contains all informations that I treat to send response back to Discord so that user can see it

Commands : /antonyms , /synonyms 

```

app.post('/interactions', async function(req, res) {

    const { type, id, data } = req.body


    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name, options } = data

        let prompt = options[0].value

        if (name === 'synonyms' || name === 'antonyms') {

            let result = await generateWords(name, prompt)

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Response : ${result}`
                },
            })

        }
    }
})

```

To generateWords (either synonyms or antonyms) I use the openai API which provide certains models of AI such as "text-davinci-003" that was developped to understand languages as human being.So it is this that I use to generates the antonyms & synonyms

```
export async function generateWords(type, prompt) {

    try {

        const edition = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Give me ${type} for the the following sentence : "${prompt}".Present them as list of element`,
            temperature: 0.5,
        }, {
            timeout: 10000,
        })

        return edition.data.choices[0].text
    } catch (error) {
        if (error.response) {
            console.log(error.response.status)
            console.log(error.response.data)
        } else {
            console.log(error.message)
        }
        return 'ERROR'
    }
}

```

## Conclusion

So that is how I create this simple discord bot.First throught the discord UI user use commands /antonyms or /synonyms and type a world.The discord bot get this and send it to open AI to get synonyms or antonyms .After the openAI API respond to my bot ,the bot send the response to the client