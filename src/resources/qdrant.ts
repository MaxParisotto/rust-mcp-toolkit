import { 
  storeDocument, 
  retrieveDocument,
  searchSimilarDocuments,
  fetchEmbedding
} from '../services/common';

export async function storeResource(id: string, text: string): Promise<void> {
  const collection = 'resources';
  await storeDocument(collection, id, text);
}

export async function retrieveResource(id: string): Promise<any> {
  const collection = 'resources';
  return retrieveDocument(collection, id);
}

export async function searchSimilarResources(text: string, limit: number = 5): Promise<any> {
  const collection = 'resources';
  const vector = await fetchEmbedding(text);
  return searchSimilarDocuments(vector, collection, limit);
}