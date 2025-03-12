"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrateInfo = getCrateInfo;
exports.getRustBookSection = getRustBookSection;
const qdrant_1 = require("../services/qdrant");
function getCrateInfo(crateName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch meaningful embedding vector using storeDocument
            const vector = yield (0, qdrant_1.storeDocument)(`Crate info for ${crateName}`, { name: crateName });
            if (!Array.isArray(vector)) {
                throw new Error('Invalid vector returned from storeDocument');
            }
            const response = yield qdrant_1.qdrantClient.search(qdrant_1.collectionName, {
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
    });
}
function getRustBookSection(section) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch meaningful embedding vector using storeDocument
            const vector = yield (0, qdrant_1.storeDocument)(`Rust book section ${section}`, { section: section });
            if (!Array.isArray(vector)) {
                throw new Error('Invalid vector returned from storeDocument');
            }
            const response = yield qdrant_1.qdrantClient.search(qdrant_1.collectionName, {
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
    });
}
