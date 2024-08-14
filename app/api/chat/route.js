import {NextResponse} from 'next/server' //import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // import openAI library for interacting with openAI api

// system prompt for the AI, providing guidlines on how to respont to users
const systemPrompt = `You are a customer support bot for HeadstarterAI, an AI-powered platform designed to help users prepare for software engineering (SWE) job interviews. Your primary role is to assist users by providing timely and accurate information, troubleshooting issues, and guiding them through the features of the platform. Maintain a friendly, professional, and helpful demeanor at all times.`

//POST function to hanlde incoming requests
export async function POST(req) {
    const openai = new OpenAI() // create a new instance of the OpenAI client
    const data = await req.json() // Parse the JSON body of the incoming request

    // Create a chat completion request to the OpenAI API
    const completion = await open.chat.completions.create({
        messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
        model: 'gpt-4o', // Specify the model to use
        stream: true, // Enable streaming responses
    })

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder() //create a TextEncoder to convert strings to Unit8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                    if (content) {
                        const text = encoder.encode(content) // Encode the content to Unit8Array
                        controller.enqueue(text) // Enqueue the encoded text to the stream
                    }
                }
            } catch (err) {
                controller.error(err) //Handle any errors that occur during streaming
            } finally {
                controller.close() // Close the stream when done
            }
        },
    })

    return new NextResponse(stream) // Return the stream as the response
}
// this sets up the API route that will handle the chat functionality and interact with the OpenAI API

