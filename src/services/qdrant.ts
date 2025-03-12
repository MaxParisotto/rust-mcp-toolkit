import { qdrantClient, ensureCollection, fetchEmbedding } from './common';
import { EMBEDDING_SERVICE_URL } from '../config';

// Define types for Qdrant responses
interface QdrantPoint {
  id: string | number;
  version: number;
  score: number;
  payload?: Record<string, unknown> | null; // Allow payload to be null or undefined
  vector?: number[] | number[][] | Record<string, unknown>[] | Record<string, unknown> | null; // Allow vector to be more complex types
}

type QdrantSearchResponse = QdrantPoint[];

// Store document and return the embedding vector
export async function storeDocument(text: string, metadata?: Record<string, any>): Promise<void> {
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
      throw new Error(`Qdrant insertion failed: ${error.message}`);
    } else {
      throw new Error('Qdrant insertion failed');
    }
  }
}

// Retrieve document by ID
export async function retrieveDocument(id: string): Promise<QdrantSearchResponse> {
  try {
    const response = await qdrantClient.search('mcp', {
      vector: [0], // Placeholder vector, replace with actual vector if needed
      filter: { must: [{ key: 'id', match: { value: id } }] },
      limit: 1
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to retrieve document with ID ${id}: ${error.message}`);
    } else {
      console.error('An unknown error occurred while retrieving the document.');
    }
    throw error;
  }
}

// Search similar documents
export async function searchSimilarDocuments(vector: number[], limit = 0): Promise<QdrantSearchResponse> {
  try {
    const response = await qdrantClient.search('mcp', {
      vector: vector,
      limit: limit
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to search similar documents: ${error.message}`);
    } else {
      console.error('An unknown error occurred while searching similar documents.');
    }
    throw error;
  }
}
