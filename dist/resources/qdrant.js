"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrateInfo = getCrateInfo;
exports.getRustBookSection = getRustBookSection;
const qdrant_1 = require("../services/qdrant");
async function getCrateInfo(crateName) {
    try {
        // Fetch meaningful embedding vector using storeDocument
        const vector = await (0, qdrant_1.storeDocument)(`Crate info for ${crateName}`, { name: crateName });
        if (!Array.isArray(vector)) {
            throw new Error('Invalid vector returned from storeDocument');
        }
        const response = await qdrant_1.qdrantClient.search(qdrant_1.collectionName, {
            vector: vector,
            limit: 1,
            filter: { key: 'name', match: { value: crateName } },
        });
        console.log(`Fetched crate info for ${crateName}:`, response);
        return response;
    }
    catch (error) {
        console.error('Error fetching crate info:', error);
        throw new Error(`Failed to fetch crate info for ${crateName}`);
    }
}
async function getRustBookSection(section) {
    try {
        // Fetch meaningful embedding vector using storeDocument
        const vector = await (0, qdrant_1.storeDocument)(`Rust book section ${section}`, { section: section });
        if (!Array.isArray(vector)) {
            throw new Error('Invalid vector returned from storeDocument');
        }
        const response = await qdrant_1.qdrantClient.search(qdrant_1.collectionName, {
            vector: vector,
            limit: 1,
            filter: { key: 'section', match: { value: section } },
        });
        console.log(`Fetched Rust book section ${section}:`, response);
        return response;
    }
    catch (error) {
        console.error('Error fetching Rust book section:', error);
        throw new Error(`Failed to fetch Rust book section ${section}`);
    }
}
