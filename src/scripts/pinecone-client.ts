
import {
    Pinecone,
    type PineconeConfiguration,
} from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "../lib/utils";
let pineconeClientInstance: Pinecone | null = null;


const customFetch = (input: string | URL | Request, init: any) => {
    return fetch(input, {
        ...init,
        keepalive: true,
    });
};

const config: PineconeConfiguration = {
    apiKey: process.env.PINECONE_API_KEY!,
    fetchApi: customFetch,
};
const pc = new Pinecone(config);

// Initialize index and ready to be accessed.
async function initPineconeClient() {
    try {
        const isExistedPC = await checkIndexExists(pc);
        if (!isExistedPC) {
            console.log("Index is not existed");
        } else {
            console.log("Your index already exists. nice !!");
        }
        return pc;
    } catch (error) {
        console.error("error", error);
        throw new Error("Failed to initialize Pinecone Client");
    }
}

async function checkIndexExists(pc: Pinecone) {
    // List all indexes
    console.log("Checking");
    const response = await pc.listIndexes();
    const indexes = response.indexes;
    console.log("Available indexes:", indexes);

    // Check if the desired index is in the list
    return indexes?.find((item) => item.name === env.PINECONE_INDEX_NAME);
}

export async function getPineconeClient() {
    if (!pineconeClientInstance) {
        pineconeClientInstance = await initPineconeClient();
    }

    return pineconeClientInstance;
}

getPineconeClient();