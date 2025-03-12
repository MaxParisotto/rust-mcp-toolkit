import { execSync } from 'child_process';
import fetch from 'node-fetch';
// Import Qdrant client
import { storeDocument } from '../services/qdrant.js';
async function getCrateDocumentation(crateName) {
    const url = `https://docs.rs/${crateName}/latest/${crateName}/index.html`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch documentation for ${crateName}`);
        }
        return await response.text();
    }
    catch (error) {
        console.error(`Error fetching documentation for ${crateName}:`, error);
        return '';
    }
}
async function main() {
    try {
        // Run cargo metadata to get list of crates
        const metadata = JSON.parse(execSync('cargo metadata --format-version 1').toString());
        const crates = metadata.packages.map((pkg) => pkg.name);
        for (const crate of crates) {
            console.log(`Fetching documentation for ${crate}`);
            const docContent = await getCrateDocumentation(crate);
            if (docContent) {
                await storeDocument(docContent, { crateName: crate });
                console.log(`Stored documentation for ${crate} in Qdrant`);
            }
        }
    }
    catch (error) {
        console.error('Error running script:', error);
    }
}
main();
