import 'dotenv/config'

import express from 'express'

import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions'

import { generateWords } from './openai.js'

import { VerifyDiscordRequest, DiscordRequest } from './utils.js'

import {
    SYNONYMOUS_COMMAND,
    ANTONYMOUS_COMMAND,
    HasGuildCommands,
    UnInstallGuildCommand
} from './commands.js'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))


app.post('/interactions', async function(req, res) {

    const { type, id, data } = req.body
    
     if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }


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



app.listen(PORT, () => {
    console.log('Listening on port', PORT)

    HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
        ANTONYMOUS_COMMAND, SYNONYMOUS_COMMAND
    ])

    /*UnInstallGuildCommand(process.env.APP_ID, process.env.GUILD_ID, [
        ANTONYMOUS_COMMAND, SYNONYMOUS_COMMAND
    ], '1054725540776517674')*/
})
