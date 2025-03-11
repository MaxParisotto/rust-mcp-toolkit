import { QdrantClient } from '@qdrant/js-client-rest'; 

const QDRANT_URL = process.env.QDRANT_URL || 'http://192.168.2.190:6333';
const COLLECTION_NAME = 'mcp';

export const qdrantClient = new QdrantClient({ 
    url: QDRANT_URL, 
    apiKey: process.env.QDRANT_API_KEY // Include API key if required
});

// Ensure collection exists before operations
export async function ensureCollection(): Promise<void> {
  try { await qdrantClient.getCollection(COLLECTION_NAME); }
   catch (error) {
  const params = { name: COLLECTION_NAME };
  await qdrantClient.createCollection(params);
  console.log(`Collection ${COLLECTION_NAME} created successfully.`);
}
}

export async function storeDocument(text: string, metadata?: Record<string, any>): Promise<void> {
  
// Fetch real embedding vector from an external service
const response = await fetch('http://localhost:5001/embeddings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ text })
});
if (!response.ok) {
  throw new Error('Failed to generate embedding');
}
const responseData = await response.json() as { vector: number[] };
const vector = responseData.vector;
  
  try{
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
   }catch(error){
     throw new Error('Qdrant insertion failed')
   }
}
