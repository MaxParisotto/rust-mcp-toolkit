"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustAssistantServer = void 0;
const server_1 = require("@modelcontextprotocol/sdk/dist/cjs/server");
class RustAssistantServer {
    server;
    constructor() {
        this.server = new server_1.Server({
            name: 'rust-assistant-server',
            version: '0.1.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    run() {
        const transport = new server_1.StdioServerTransport();
        this.server.connect(transport).catch(console.error);
        console.error('Rust Assistant MCP server running on stdio');
    }
}
exports.RustAssistantServer = RustAssistantServer;
