import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
const COLLECTION_NAME = 'mcp';

export const qdrantClient = new QdrantClient({ 
    url: QDRANT_URL, 
    apiKey: process.env.QDRANT_API_KEY // Include API key if required
});

// Ensure collection exists before operations
export async function ensureCollection(): Promise<void> {
  try { 
    await qdrantClient.getCollection(COLLECTION_NAME); 
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to get collection: ${error.message}`);
    } else {
      console.error('An unknown error occurred while getting the collection.');
    }
    
    try {
      const params = {
        vectors: {
          size: 128, // Example vector size, adjust as needed
          distance: 'Cosine' as const // Ensure the type is one of the allowed literals
        },
        hnsw_config: {
          m: 16,
          ef_construct: 100,
          full_scan_threshold: 10000
        }
      };
      await qdrantClient.createCollection(COLLECTION_NAME, params);
      console.log(`Collection ${COLLECTION_NAME} created successfully.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to create collection: ${error.message}`);
      } else {
        console.error('An unknown error occurred while creating the collection.');
      }
    }
  }
}

// Store document and return the embedding vector
export async function storeDocument(text: string, metadata?: Record<string, any>): Promise<void> {
  // Fetch real embedding vector from an external service
  const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:5001/embeddings';

  try {
    const response = await fetch(EMBEDDING_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate embedding. Status code: ${response.status}`);
    }

    const responseData = await response.json() as { vector: number[] };
    const vector = responseData.vector;

    try {
      await qdrantClient.upsert(
        COLLECTION_NAME,
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
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error storing document in Qdrant: ${error.message}`);
    } else {
      console.error('An unknown error occurred while storing the document.');
    }
    throw error;
  }
}

// Retrieve document by ID
export async function retrieveDocument(id: string): Promise<any> {
  try {
    const response = await qdrantClient.search(COLLECTION_NAME, {
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
export async function searchSimilarDocuments(vector: number[], limit = 5): Promise<any> {
  try {
    const response = await qdrantClient.search(COLLECTION_NAME, {
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
