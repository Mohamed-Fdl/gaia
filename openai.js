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

    try {

        const edition = await openai.createEdit({
            model: "text-davinci-edit-001",
            input: prompt,
            instruction: "Write a synonym for this sentence",
            temperature: 1,
            n: 1
        }, {
            timeout: 10000,
        });

        return edition.data.choices[0].text
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        return 'ERROR'
    }

}

export async function antonymPrompt(prompt) {

    try {

        const edition = await openai.createEdit({
            model: "text-davinci-edit-001",
            input: prompt,
            instruction: "Write an antonym for this sentence",
            temperature: 1,
            n: 1
        }, {
            timeout: 10000,
        });

        return edition.data.choices[0].text
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        return 'ERROR'
    }

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

const s = await synonymPrompt('I am good!!')

console.log(s)