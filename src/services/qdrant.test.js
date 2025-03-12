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
const qdrant_1 = require("./qdrant");
// Mock data for testing
const mockText = 'This is a test document.';
const mockMetadata = { author: 'Test Author' };
// Test cases
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, qdrant_1.ensureCollection)();
}));
describe('Qdrant Service Tests', () => {
    it('should store and retrieve a document by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = Math.floor(Date.now()).toString();
        yield (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const retrievedDoc = yield (0, qdrant_1.retrieveDocument)(id);
        expect(retrievedDoc).toBeDefined();
        expect(retrievedDoc[0].payload.text).toBe(mockText);
    }));
    it('should search for similar documents', () => __awaiter(void 0, void 0, void 0, function* () {
        const id1 = Math.floor(Date.now()).toString();
        yield (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const vector = [0.1, 0.2, 0.3]; // Example vector
        const similarDocs = yield (0, qdrant_1.searchSimilarDocuments)(vector);
        expect(similarDocs).toBeDefined();
        expect(similarDocs.length).toBeGreaterThan(0);
    }));
    it('should retrieve a document by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = Math.floor(Date.now()).toString();
        yield (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const retrievedDoc = yield (0, qdrant_1.retrieveDocument)(id);
        expect(retrievedDoc).toBeDefined();
        expect(retrievedDoc[0].payload.text).toBe(mockText);
    }));
    it('should search for similar documents', () => __awaiter(void 0, void 0, void 0, function* () {
        const id1 = Math.floor(Date.now()).toString();
        yield (0, qdrant_1.storeDocument)(mockText, mockMetadata);
        const vector = [0.1, 0.2, 0.3]; // Example vector
        const similarDocs = yield (0, qdrant_1.searchSimilarDocuments)(vector);
        expect(similarDocs).toBeDefined();
        expect(similarDocs.length).toBeGreaterThan(0);
    }));
});
