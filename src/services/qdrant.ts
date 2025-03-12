import { QdrantClient } from '@qdrant/js-client-rest';

const qdrantUrl = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
export const collectionName = process.env.COLLECTION_NAME || 'mcp';

console.log(`Qdrant URL: ${qdrantUrl}`);
console.log(`Collection Name: ${collectionName}`);

class QdrantService {
  private static instance: QdrantClient;

  public static getInstance(): QdrantClient {
    if (!QdrantService.instance) {
      QdrantService.instance = new QdrantClient({ url: qdrantUrl });
    }
    return QdrantService.instance;
  }

  private constructor() {}
}

const qdrantClient = QdrantService.getInstance();

async function ensureCollection(): Promise<void> {
  try {
    await qdrantClient.getCollection(collectionName);
    console.log(`Collection ${collectionName} already exists.`);
  } catch (error: any) {
    if (error.status === 404) {
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: 1536, // Example vector size
          distance: 'Cosine',
        },
      });
      console.log(`Collection ${collectionName} created.`);
    } else {
      throw new Error(`Failed to ensure collection: ${error.message}`);
    }
  }
}

async function storeDocument(text: string, metadata: Record<string, any>): Promise<void> {
  const vector = await generateVector(text); // Assuming a function to generate vectors
  await qdrantClient.upsert(collectionName, {
    points: [
      {
        id: Date.now().toString(), // Simple ID generation for demonstration purposes
        vector,
        payload: { text, ...metadata },
      }
    ]
  });
}

async function retrieveDocument(id: string): Promise<any> {
  const response = await qdrantClient.retrieve(collectionName, {
    ids: [id],
    with_payload: true,
  });
  return response;
}

async function searchSimilarDocuments(vector: number[], limit = 5): Promise<any> {
  const response = await qdrantClient.search(collectionName, {
    vector,
    limit,
  });
  return response;
}

function generateVector(text: string): number[] {
  // Placeholder for vector generation logic
  // In a real-world scenario, this would involve using an embedding model to convert text to vectors
  return Array(1536).fill(0); // Dummy vector of length 1536 (example size)
}

export { qdrantClient, storeDocument, retrieveDocument, searchSimilarDocuments, ensureCollection };
