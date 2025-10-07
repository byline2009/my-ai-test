import { env } from "./config";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  Pinecone,
  type PineconeConfiguration,
} from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";


export async function embedDocs(docs: any) {
  /*create and store the embeddings in the vectorStore*/
  try {
    const embedder = new OpenAIEmbeddings(
      {
        openAIApiKey: process.env.OPENAI_API_KEY,
        batchSize: 512, // Default value if omitted is 512. Max is 2048
        modelName: "text-embedding-3-large",
      }
    );

    //embed the PDF documents
    const embeddingsDataArr = []; //[{embedding: [], chunk: '}]
    console.log("docs", docs);

    for (const chunk of docs) {
      const embedding = await embedder.embedQuery(chunk);
      // console.log("Embedding ", embedding);
      embeddingsDataArr.push({
        embedding,
        chunk,
      });
    }

    return embeddingsDataArr;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs !");
  }
}

export async function storeEmbeddings(client: Pinecone, embeddings: any) {
  const index = client.index(env.PINECONE_INDEX_NAME);
  for (let i = 0; i < embeddings.length; i++) {
    await index.namespace(env.PINECONE_NAME_SPACE).upsert([
      {
        id: `chunk-${i}`,
        values: embeddings[i].embedding,
        metadata: { chunk: embeddings[i].chunk },
      },
    ]);
  }
}

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings(
      {
        openAIApiKey: process.env.OPENAI_API_KEY,
        batchSize: 512, // Default value if omitted is 512. Max is 2048
        modelName: "text-embedding-3-large",
      }
    );
    const index = client.Index(env.PINECONE_INDEX_NAME);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      namespace: env.PINECONE_NAME_SPACE,
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
