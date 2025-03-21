import { QdrantClient, Point } from '@qdrant/js-client-rest';

const qdrantClient = new QdrantClient({
  url: 'http://192.168.2.190:6333',
});
export { qdrantClient };
export async function createCollection(collectionName: string): Promise<void> {
  return qdrantClient.createCollection(collectionName, {
    vectors: {
      size: 1536,
      distance: 'Cosine'
    }
  });
}

export async function storeDocument(
  collectionName: string,
  id: string,
  text: string
): Promise<void> {
  const vector = await fetchEmbedding(text);
  try {
    await qdrantClient.upsertPoints(collectionName, {
      points: [{
        id: Number(id),
        vector,
        payload: { text }
      }]
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      await createCollection(collectionName);
      return storeDocument(collectionName, id, text);
    }
    throw error;
  }
}
export async function retrieveDocument(collectionName: string, id: string): Promise<Point> {
  return qdrantClient.getPoint(collectionName, Number(id), {
    with_vectors: true,
    with_payload: true
  });
}

export async function searchSimilarDocuments(
  queryVector: number[],
  collectionName: string,
  limit: number = 5
): Promise<Point[]> {
  return qdrantClient.searchPoints(collectionName, {
    vector: { name: 'vector', vector: queryVector },
    limit,
    with_payload: true,
    with_vectors: true
  });
}

export async function fetchEmbedding(_text: string): Promise<number[]> {
  // TODO: Replace with actual embedding model
  return Array(1536).fill(0).map(() => Math.random());
}