import axios from "axios";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

const API_URL_PINECONE = process.env.API_URL_PINECONE;

export async function POST(req) {
    const body = await req.json();

    const question = body.message;

    console.log("body", body);

    if (!question || !Array.isArray(question)) {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/embeddings",
                {
                    model: "text-embedding-3-large",
                    input: question,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    }

                }
            );

            let embeddings = [];
            if (response && response.data[0] && response.data[0].embedding) {
                embeddings = response.data[0].embedding;
            } else {
                embeddings = response.data.data[0].embedding;
            }
            console.log("embeddings", embeddings)
            // Send query request to Pinecone
            const response2 = await axios.post(
                API_URL_PINECONE,
                {
                    vector: embeddings, // The embedding vector you are querying
                    top_k: 5, // Return top 5 matches
                    namespace: process.env.PINECONE_NAME_SPACE,
                    include_metadata: true, // If you want metadata to be returned
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PINECONE_API_KEY}`,
                        "Content-Type": "application/json",
                        "Api-Key": process.env.PINECONE_API_KEY,
                    }
                }
            );
            let dataRes;
            console.log("response2", response2);
            //         if (response2.matches) {
            //             dataRes = response2.matches;
            //         } else {
            //             dataRes = response2.data.matches;
            //         }
            //         console.log("dataRes", dataRes);

            //         // Send the response back to the client
            //         const retrievedChunks = dataRes.map((match) => match.metadata.chunk);
            //         console.log("retrievedChunks", retrievedChunks);

            //         const llm = new ChatOpenAI(
            //             {
            //                 model: "gpt-4o-mini",
            //             });

            //         // Join retrieved chunks into a single context string
            //         const context = retrievedChunks.join(" ");

            //         // Construct the prompt with specific instructions
            //         const systemMessage = `You are an AI that answers questions strictly based on the provided context.
            //   If the context doesn't contain enough information, respond with "I do not have enough info to answer this question."`;

            //         const humanMessage = `Context: ${context}\n\nQuestion: ${question}`;

            //         // Invoke the LLM with the system and human messages
            //         const aiMsg = await llm.invoke([
            //             ["system", systemMessage],
            //             ["human", humanMessage],
            //         ]);

            //         // Extract the answer from the model's response
            //         const answer = aiMsg.content.trim();
            //         console.log("answer", answer);
            let answer = "";

            return NextResponse.json({ message: answer }, { status: 200 });
        } catch (error) {
            console.error("Error generating embeddings:", error);
            return NextResponse.status(500).json({
                error: "Failed to generate embeddings",
            });
        }
    } else {
        return NextResponse.json({ message: "" }, { status: 200 });
    }
}
