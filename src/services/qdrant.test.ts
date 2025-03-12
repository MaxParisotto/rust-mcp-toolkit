import { ensureCollection, storeDocument, retrieveDocument, searchSimilarDocuments } from './qdrant.ts';

// Mock data for testing
const mockText = 'This is a test document.';
const mockMetadata = { author: 'Test Author' };

// Test cases
beforeAll(async () => {
  await ensureCollection();
});

describe('Qdrant Service Tests', () => {
  it('should store and retrieve a document by ID', async () => {
    const id = Math.floor(Date.now()).toString();
    await storeDocument(mockText, mockMetadata);
    const retrievedDoc = await retrieveDocument(id);
    expect(retrievedDoc).toBeDefined();
    expect(retrievedDoc[0].payload.text).toBe(mockText);
  });

  it('should search for similar documents', async () => {
    const id1 = Math.floor(Date.now()).toString();
    await storeDocument(mockText, mockMetadata);
    const vector = [0.1, 0.2, 0.3]; // Example vector
    const similarDocs = await searchSimilarDocuments(vector);
    expect(similarDocs).toBeDefined();
    expect(similarDocs.length).toBeGreaterThan(0);
  });

  it('should retrieve a document by ID', async () => {
    const id = Math.floor(Date.now()).toString();
    await storeDocument(mockText, mockMetadata);
    const retrievedDoc = await retrieveDocument(id);
    expect(retrievedDoc).toBeDefined();
    expect(retrievedDoc[0].payload.text).toBe(mockText);
  });

  it('should search for similar documents', async () => {
    const id1 = Math.floor(Date.now()).toString();
    await storeDocument(mockText, mockMetadata);
    const vector = [0.1, 0.2, 0.3]; // Example vector
    const similarDocs = await searchSimilarDocuments(vector);
    expect(similarDocs).toBeDefined();
    expect(similarDocs.length).toBeGreaterThan(0);
  });

});