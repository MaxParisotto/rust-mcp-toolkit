"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qdrantClient = exports.collectionName = void 0;
exports.storeDocument = storeDocument;
exports.retrieveDocument = retrieveDocument;
exports.searchSimilarDocuments = searchSimilarDocuments;
exports.ensureCollection = ensureCollection;
const qdrant_client_1 = require("qdrant-client");
const qdrantUrl = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
exports.collectionName = process.env.COLLECTION_NAME || 'mcp';
console.log(`Qdrant URL: ${qdrantUrl}`);
console.log(`Collection Name: ${exports.collectionName}`);
const config = {
    basePath: qdrantUrl,
};
class QdrantService {
    static instance;
    static getInstance() {
        if (!QdrantService.instance) {
            // Directly initialize the Api class with an empty object
            QdrantService.instance = new qdrant_client_1.Api(config);
        }
        return QdrantService.instance;
    }
    constructor() { }
}
const qdrantClient = QdrantService.getInstance();
exports.qdrantClient = qdrantClient;
async function ensureCollection() {
    try {
        await qdrantClient.collections.getCollection({ collection_name: exports.collectionName });
        console.log(`Collection ${exports.collectionName} already exists.`);
    }
    catch (error) {
        if (error.status === 404) {
            await qdrantClient.collections.upsertCollection({
                create_collection: {
                    vectors: {
                        size: 1536, // Example vector size
                        distance: 'Cosine',
                    },
                },
                collection_name: exports.collectionName,
            });
            console.log(`Collection ${exports.collectionName} created.`);
        }
        else {
            throw new Error(`Failed to ensure collection: ${error.message}`);
        }
    }
}
async function storeDocument(text, metadata) {
    const vector = await generateVector(text); // Assuming a function to generate vectors
    await qdrantClient.points.upsertPoints({
        collection_name: exports.collectionName,
        points: [
            {
                id: Date.now().toString(), // Simple ID generation for demonstration purposes
                vector,
                payload: { text, ...metadata },
            }
        ]
    });
}
async function retrieveDocument(id) {
    const response = await qdrantClient.points.getPoint({
        collection_name: exports.collectionName,
        id,
        with_payload: true,
    });
    return response;
}
async function searchSimilarDocuments(vector, limit = 5) {
    const response = await qdrantClient.points.searchPoints({
        collection_name: exports.collectionName,
        vector_search_query: {
            vector,
            params: {
                top: limit,
            },
        },
    });
    return response;
}
function generateVector(text) {
    // Placeholder for vector generation logic
    // In a real-world scenario, this would involve using an embedding model to convert text to vectors
    return Array(1536).fill(0); // Dummy vector of length 1536 (example size)
}
