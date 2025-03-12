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
exports.qdrantClient = exports.collectionName = void 0;
exports.storeDocument = storeDocument;
exports.retrieveDocument = retrieveDocument;
exports.searchSimilarDocuments = searchSimilarDocuments;
exports.ensureCollection = ensureCollection;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const qdrantUrl = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
exports.collectionName = process.env.COLLECTION_NAME || 'mcp';
console.log(`Qdrant URL: ${qdrantUrl}`);
console.log(`Collection Name: ${exports.collectionName}`);
class QdrantService {
    static getInstance() {
        if (!QdrantService.instance) {
            QdrantService.instance = new js_client_rest_1.QdrantClient({ url: qdrantUrl });
        }
        return QdrantService.instance;
    }
    constructor() { }
}
const qdrantClient = QdrantService.getInstance();
exports.qdrantClient = qdrantClient;
function ensureCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield qdrantClient.getCollection(exports.collectionName);
            console.log(`Collection ${exports.collectionName} already exists.`);
        }
        catch (error) {
            if (error.status === 404) {
                yield qdrantClient.createCollection(exports.collectionName, {
                    vectors: {
                        size: 1536, // Example vector size
                        distance: 'Cosine',
                    },
                });
                console.log(`Collection ${exports.collectionName} created.`);
            }
            else {
                throw new Error(`Failed to ensure collection: ${error.message}`);
            }
        }
    });
}
function storeDocument(text, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const vector = yield generateVector(text); // Assuming a function to generate vectors
        yield qdrantClient.upsert(exports.collectionName, {
            points: [
                {
                    id: Date.now().toString(), // Simple ID generation for demonstration purposes
                    vector,
                    payload: Object.assign({ text }, metadata),
                }
            ]
        });
    });
}
function retrieveDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield qdrantClient.retrieve(exports.collectionName, {
            ids: [id],
            with_payload: true,
        });
        return response;
    });
}
function searchSimilarDocuments(vector_1) {
    return __awaiter(this, arguments, void 0, function* (vector, limit = 5) {
        const response = yield qdrantClient.search(exports.collectionName, {
            vector,
            limit,
        });
        return response;
    });
}
function generateVector(text) {
    // Placeholder for vector generation logic
    // In a real-world scenario, this would involve using an embedding model to convert text to vectors
    return Array(1536).fill(0); // Dummy vector of length 1536 (example size)
}
