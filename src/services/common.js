"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qdrantClient = void 0;
exports.ensureCollection = ensureCollection;
exports.fetchEmbedding = fetchEmbedding;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const QDRANT_URL = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
const COLLECTION_NAME = 'mcp';
exports.qdrantClient = new js_client_rest_1.QdrantClient({
    url: QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY // Include API key if required
});
// Ensure collection exists before operations
function ensureCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.qdrantClient.getCollection(COLLECTION_NAME);
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
                yield exports.qdrantClient.createCollection(COLLECTION_NAME, params);
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
    });
}
// Fetch real embedding vector from an external service
function fetchEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:5001/embeddings';
        try {
            const response = yield fetch(EMBEDDING_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            if (!response.ok) {
                throw new Error(`Failed to generate embedding. Status code: ${response.status}`);
            }
            const responseData = yield response.json();
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
    });
}
