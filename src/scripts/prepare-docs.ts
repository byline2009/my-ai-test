import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { env } from "./config";
import { getChunkedDocsFromPDF } from "./pdf-loader";
import { getPineconeClient } from "./pinecone-client";
import { embedDocs, storeEmbeddings } from "./vector-store";

(async () => {
    try {
        const pineconeClient = await getPineconeClient();
        console.log("Preparing chunks from PDF file");
        let documents = await getChunkedDocsFromPDF();
        console.log(`Loading ${documents.length} chunks into pinecone...`);
        const embedData = await embedDocs(documents);
        console.log("Data embedded and stored in pine-cone index");
        await storeEmbeddings(pineconeClient, embedData);

        //     const chat = new ChatOpenAI(
        //         {
        //             temperature: 0,
        //             openAIApiKey: env.OPENAI_API_KEY,
        //         }
        //     );
        //     const systemMessage = `You are an AI that answers questions strictly based on the provided context.
        // If the context doesn't contain enough information, respond with "I do not have enough info to answer this question."`;
        //     const humanMessage = "what is WikiPedia ?";
        //     try {
        //         const response = await chat.invoke([
        //             ["system", systemMessage],
        //             ["human", humanMessage],
        //         ]);
        //         console.log(response);
        //     } catch (e) {
        //         console.log(e);
        //     }

        //     const embedder = new OpenAIEmbeddings(
        //         {
        //             openAIApiKey: process.env.OPENAI_API_KEY,
        //             batchSize: 512, // Default value if omitted is 512. Max is 2048
        //             modelName: "text-embedding-3-large",
        //         }

        //     );

        //     //embed the PDF documents
        //     const embeddingsDataArr = []; //[{embedding: [], chunk: '}]
        //     const docs = ["thông tin gói D10"];

        //     for (const chunk of docs) {
        //         const embedding = await embedder.embedQuery(chunk);
        //         // console.log("Embedding ", embedding);
        //         embeddingsDataArr.push({
        //             embedding,
        //             chunk,
        //         });
        //         console.log("Embedding value", embedding);
        //     }
    } catch (error) {
        console.error("❌ Error:", error);
    }
})();


