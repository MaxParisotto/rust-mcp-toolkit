import { storeDocument } from '../services/qdrant';

export async function fetchCrateDocs(crateName: string): Promise<void> {
  const data = `Crate info for ${crateName}`;
  const id = Date.now().toString(); // Generate a unique numeric ID as string
  await storeDocument(id, data, 'crates'); // Pass collectionName
}