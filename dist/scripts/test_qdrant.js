"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qdrant_js_1 = require("../services/qdrant.js");
async function testQdrant() {
    // Example logic to test Qdrant functionality
    console.log('Testing Qdrant functionality');
    const text = 'Example document content';
    const metadata = { example: true };
    try {
        // Store a document
        await (0, qdrant_js_1.storeDocument)(text, metadata);
        console.log('Document stored successfully');
        // Retrieve the document
        const response = await (0, qdrant_js_1.retrieveDocument)(Date.now().toString());
        console.log('Document retrieved:', response);
        // Search for similar documents
        const vector = [0.1, 0.2, 0.3]; // Example vector
        const searchResults = await (0, qdrant_js_1.searchSimilarDocuments)(vector);
        console.log('Search results:', searchResults);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error during Qdrant test: ${error.message}`);
        }
    }
}
// Example usage
testQdrant();
