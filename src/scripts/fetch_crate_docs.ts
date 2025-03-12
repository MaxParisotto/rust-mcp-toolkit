import { qdrantClient, storeDocument } from '../services/qdrant.js';

async function fetchCrateDocs(crateName: string) {
  // Example logic to fetch crate documentation
  console.log(`Fetching documentation for ${crateName}`);
  try {
    const response = await fetch(`https://docs.rs/${crateName}/latest/${crateName}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation: ${response.statusText}`);
    }
    const data = await response.text();
    console.log('Documentation fetched successfully');
    // Store the document in Qdrant
    await storeDocument(data, { crateName });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching documentation: ${error.message}`);
    }
  }
}

// Example usage
fetchCrateDocs('serde');