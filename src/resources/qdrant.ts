import {QdrantClient} from '@qdrant/js-client-rest';

const qdrantClient = new QdrantClient({
  url: 'http://192.168.2.190:6333',
});

export async function getCrateInfo(crateName: string) {
  try {
    const response = await qdrantClient.search('crates', {
      vector: [0, 0, 0], // Placeholder vector
      limit: 1,
      filter: { key: 'name', match: { value: crateName } },
    });
    return response;
  } catch (error) {
    console.error('Error fetching crate info:', error);
    throw error;
  }
}

export async function getRustBookSection(section: string) {
  try {
    const response = await qdrantClient.search('rust-book', {
      vector: [0, 0, 0], // Placeholder vector
      limit: 1,
      filter: { key: 'section', match: { value: section } },
    });
    return response;
  } catch (error) {
    console.error('Error fetching Rust book section:', error);
    throw error;
  }
}