import { QdrantClient } from '@qdrant/js-client-rest';
const QDRANT_URL = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
const COLLECTION_NAME = 'mcp';
export const qdrantClient = new QdrantClient({
    url: QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY // Include API key if required
});
// Ensure collection exists before operations
export async function ensureCollection() {
    try {
        await qdrantClient.getCollection(COLLECTION_NAME);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Failed to get collection: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while getting the collection.');
        }
        try {
            const params = {
                vectors: {
                    size: 128, // Example vector size, adjust as needed
                    distance: 'Cosine' // Ensure the type is one of the allowed literals
                },
                hnsw_config: {
                    m: 16,
                    ef_construct: 100,
                    full_scan_threshold: 10000
                }
            };
            await qdrantClient.createCollection(COLLECTION_NAME, params);
            console.log(`Collection ${COLLECTION_NAME} created successfully.`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to create collection: ${error.message}`);
            }
            else {
                console.error('An unknown error occurred while creating the collection.');
            }
        }
    }
}
// Fetch real embedding vector from an external service
export async function fetchEmbedding(text) {
    const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:5001/embeddings';
    try {
        const response = await fetch(EMBEDDING_SERVICE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        if (!response.ok) {
            throw new Error(`Failed to generate embedding. Status code: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData.vector;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching embedding: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while fetching the embedding.');
        }
        throw error;
    }
}
