"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qdrant_js_1 = require("../services/qdrant.js");
async function fetchCrateDocs(crateName) {
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
        await (0, qdrant_js_1.storeDocument)(data, { crateName });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching documentation: ${error.message}`);
        }
    }
}
// Example usage
fetchCrateDocs('serde');
