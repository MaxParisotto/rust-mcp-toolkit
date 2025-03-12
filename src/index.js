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
exports.RustAssistantServer = void 0;
const server_1 = require("@modelcontextprotocol/sdk/server");
const types_1 = require("@modelcontextprotocol/sdk/types");
const toolHandlers_1 = require("./handlers/toolHandlers");
class RustAssistantServer {
    constructor() {
        this.server = new server_1.Server({
            name: 'rust-assistant-server',
            version: '0.1.0',
        }, {
            resources: {},
            tools: {},
        });
        (0, toolHandlers_1.setupToolHandlers)(this.server);
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            yield this.server.close();
            process.exit(0);
        }));
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const transport = new server_1.StdioServerTransport();
            yield this.server.connect(transport);
            console.error('Rust Assistant MCP server running on stdio');
        });
    }
    handleProcessOutput(process, output) {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for handling process output
            return { content: { text: `Handling process output: ${output}` } };
        });
    }
    generateErrorFixes(errorCode, context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for generating error fixes
            return { suggestedFix: `Generated fix for error code ${errorCode} with context: ${context}` };
        });
    }
    handleToolRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.params.arguments || typeof request.params.arguments !== 'object') {
                throw new types_1.McpError(types_1.ErrorCode.InvalidRequest, 'Invalid arguments');
            }
            const { toolName, arguments: args } = request.params.arguments;
            if (typeof toolName !== 'string' || !args) {
                throw new types_1.McpError(types_1.ErrorCode.InvalidRequest, 'Tool name must be a string and arguments must be provided');
            }
            // Placeholder for handling tool requests
            console.log(`Handling tool request for ${toolName} with args:`, args);
            return { content: ['Tool request handled successfully'] };
        });
    }
}
exports.RustAssistantServer = RustAssistantServer;
const server = new RustAssistantServer();
server.run().catch(console.error);
