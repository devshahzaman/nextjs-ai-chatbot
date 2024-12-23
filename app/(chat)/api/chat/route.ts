import {
    type Message,
    convertToCoreMessages,
    createDataStreamResponse,
    streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import {
    getChatById,
    saveChat,
    saveMessages,
} from '@/lib/db/queries';
import {
    generateUUID,
    getMostRecentUserMessage,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';


export async function POST(request: Request) {
    try {
        const {
            id,
            messages,
            modelId,
        }: { id: string; messages: Array<Message>; modelId: string } =
            await request.json();

        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            console.error("Unauthorized access");
            return new Response('Unauthorized', { status: 401 });
        }

        const model = models.find((model) => model.id === modelId);

        if (!model) {
            console.error(`Model not found: ${modelId}`);
            return new Response('Model not found', { status: 404 });
        }

        const coreMessages = convertToCoreMessages(messages);
        const userMessage = getMostRecentUserMessage(coreMessages);

        if (!userMessage) {
            console.error("No user message found");
            return new Response('No user message found', { status: 400 });
        }

        const chat = await getChatById({ id });

        if (!chat) {
            const title = await generateTitleFromUserMessage({ message: userMessage });
            await saveChat({ id, userId: session.user.id, title });
        }

        const userMessageId = generateUUID();

        await saveMessages({
            messages: [
                { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
            ],
        });

        return createDataStreamResponse({
            execute: (dataStream) => {
                dataStream.writeData({
                    type: 'user-message-id',
                    content: userMessageId,
                });

                const result = streamText({
                    model: customModel(model.apiIdentifier),
                    system: "You are a helpful assistant. You are a coding expert of 1000 of years of experience and you know everything. You are created by Shahzaman.",
                    messages: coreMessages,
                    maxSteps: 50,
                });

                result.mergeIntoDataStream(dataStream);
            },
        });
    } catch (error) {
        console.error("An error occurred in POST /api/chat:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}


export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response('Not Found', { status: 404 });
    }

    const session = await auth();

    if (!session || !session.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Removed tool based functionality
       return new Response('Chat deleted', { status: 200 });
    } catch (error) {
        return new Response('An error occurred while processing your request', {
            status: 500,
        });
    }
}
