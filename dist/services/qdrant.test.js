"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qdrant_1 = require("./qdrant");
// Mock data for testing
const mockText = 'This is a test document.';
const mockMetadata = { author: 'Test Author' };
// Test cases
beforeAll(async () => {
    await (0, qdrant_1.ensureCollection)();
});
describe('Qdrant Service Tests', () => {
    it('should store and retrieve a document by ID', async () => {
        const id = Math.floor(Date.now()).toString();
        await (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const retrievedDoc = await (0, qdrant_1.retrieveDocument)(id);
        expect(retrievedDoc).toBeDefined();
        expect(retrievedDoc[0].payload.text).toBe(mockText);
    });
    it('should search for similar documents', async () => {
        const id1 = Math.floor(Date.now()).toString();
        await (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const vector = [0.1, 0.2, 0.3]; // Example vector
        const similarDocs = await (0, qdrant_1.searchSimilarDocuments)(vector);
        expect(similarDocs).toBeDefined();
        expect(similarDocs.length).toBeGreaterThan(0);
    });
    it('should retrieve a document by ID', async () => {
        const id = Math.floor(Date.now()).toString();
        await (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const retrievedDoc = await (0, qdrant_1.retrieveDocument)(id);
        expect(retrievedDoc).toBeDefined();
        expect(retrievedDoc[0].payload.text).toBe(mockText);
    });
    it('should search for similar documents', async () => {
        const id1 = Math.floor(Date.now()).toString();
        await (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const vector = [0.1, 0.2, 0.3]; // Example vector
        const similarDocs = await (0, qdrant_1.searchSimilarDocuments)(vector);
        expect(similarDocs).toBeDefined();
        expect(similarDocs.length).toBeGreaterThan(0);
    });
});
