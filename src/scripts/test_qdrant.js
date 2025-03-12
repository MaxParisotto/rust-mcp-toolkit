import { qdrantClient, storeDocument, searchSimilarDocuments, ensureCollection } from '../services/qdrant';
async function runTests() {
    try {
        // Ensure collection exists
        await ensureCollection();
        // Store a document
        const text = "This is a test document.";
        const metadata = { author: "Roo" };
        await storeDocument(text, metadata);
        console.log("Document stored successfully.");
        // Retrieve the document
        const documents = await qdrantClient.points.getPoints({
            collection_name: process.env.COLLECTION_NAME || 'mcp',
            limit: 1,
            with_payload: true,
        });
        console.log("Retrieved Documents:", documents);
        // Search for similar documents
        const vector = Array(1536).fill(0); // Dummy vector of length 1536 (example size)
        const similarDocuments = await searchSimilarDocuments(vector);
        console.log("Similar Documents:", similarDocuments);
    }
    catch (error) {
        console.error("Error during tests:", error);
    }
}
runTests();
