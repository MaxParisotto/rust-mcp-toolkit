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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const node_fetch_1 = __importDefault(require("node-fetch"));
// Import Qdrant client
const qdrant_js_1 = require("../services/qdrant.js");
function getCrateDocumentation(crateName) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://docs.rs/${crateName}/latest/${crateName}/index.html`;
        try {
            const response = yield (0, node_fetch_1.default)(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch documentation for ${crateName}`);
            }
            return yield response.text();
        }
        catch (error) {
            console.error(`Error fetching documentation for ${crateName}:`, error);
            return '';
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Run cargo metadata to get list of crates
            const metadata = JSON.parse((0, child_process_1.execSync)('cargo metadata --format-version 1').toString());
            const crates = metadata.packages.map((pkg) => pkg.name);
            for (const crate of crates) {
                console.log(`Fetching documentation for ${crate}`);
                const docContent = yield getCrateDocumentation(crate);
                if (docContent) {
                    yield (0, qdrant_js_1.storeDocument)(docContent, { crateName: crate });
                    console.log(`Stored documentation for ${crate} in Qdrant`);
                }
            }
        }
        catch (error) {
            console.error('Error running script:', error);
        }
    });
}
main();
