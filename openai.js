import 'dotenv/config';

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function isModerate(prompt) {

    const moderation = await openai.createModeration({
        input: prompt
    });

    return !moderation.data.results[0].flagged
}

export async function synonymPrompt(prompt) {

    const moderation = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: prompt,
        instruction: "Write a synonym for this sentence",
        temperature: 1
    });

    return moderation.data.choices[0].text
}

export async function antonymPrompt(prompt) {

    const moderation = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: prompt,
        instruction: "Write an antonym for this sentence",
        temperature: 1
    });

    return moderation.data.choices[0].text
}

async function testRecap(prompt) {

    if (await isModerate(prompt)) {
        console.log('we can continue')
        const response = await synonymPrompt(prompt)
        console.log(response)
        return response
    } else {
        console.log('stop')
        return
    }

}