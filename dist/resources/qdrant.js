import { storeDocument, retrieveDocument, searchSimilarDocuments, fetchEmbedding } from '../services/common';
export async function storeResource(id, text) {
    const collection = 'resources';
    await storeDocument(collection, id, text);
}
export async function retrieveResource(id) {
    const collection = 'resources';
    return retrieveDocument(collection, id);
}
export async function searchSimilarResources(text, limit = 5) {
    const collection = 'resources';
    const vector = await fetchEmbedding(text);
    return searchSimilarDocuments(vector, collection, limit);
}
