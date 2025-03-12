import { qdrantClient, ensureCollection, fetchEmbedding } from './common';
import { EMBEDDING_SERVICE_URL } from '../config';

// Store document and return the embedding vector
export async function storeDocument(text, metadata) {
  const vector = await fetchEmbedding(text);

  try {
    await qdrantClient.upsert(
      'mcp',
      {
        points: [{
          id: Math.floor(Date.now()).toString(),
          payload: { text, ...metadata },
          vector: vector
        }]
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[storeDocument] Qdrant insertion failed for text: ${text}. Error: ${error.message}`);
      throw error;
    } else {
      console.error('[storeDocument] An unknown error occurred while inserting into Qdrant.');
      throw new Error('Qdrant insertion failed');
    }
  }
}

// Retrieve document by ID
export async function retrieveDocument(id) {
  try {
    const response = await qdrantClient.search('mcp', {
      vector: [0], // Placeholder vector, replace with actual vector if needed
      filter: { must: [{ key: 'id', match: { value: id } }] },
      limit: 1
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[retrieveDocument] Failed to retrieve document with ID ${id}. Error: ${error.message}`);
      throw error;
    } else {
      console.error('[retrieveDocument] An unknown error occurred while retrieving the document.');
      throw new Error('Failed to retrieve document');
    }
  }
}

// Search similar documents
export async function searchSimilarDocuments(vector, limit = 5) {
  try {
    const response = await qdrantClient.search('mcp', {
      vector: vector,
      limit: limit
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[searchSimilarDocuments] Failed to search similar documents. Vector: ${vector}. Limit: ${limit}. Error: ${error.message}`);
      throw error;
    } else {
      console.error('[searchSimilarDocuments] An unknown error occurred while searching similar documents.');
      throw new Error('Failed to search similar documents');
    }
  }
}
