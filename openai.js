import 'dotenv/config'

import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function isModerate(prompt) {

    const moderation = await openai.createModeration({
        input: prompt
    })

    return !moderation.data.results[0].flagged
}

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