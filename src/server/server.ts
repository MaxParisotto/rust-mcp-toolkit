import { storeDocument } from '../services/common';

export async function startServer() {
  console.log('Starting server');

  const id = Date.now().toString(); // Generate a unique numeric ID as string
  const data = `Data for ${id}`;
  await storeDocument(id, data, 'server_collection'); // Pass collectionName

  console.log('Server started');
}
