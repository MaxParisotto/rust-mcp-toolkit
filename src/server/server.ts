import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { qdrantClient, storeDocument } from '../services/qdrant.js';

export class RustAssistantServer {
    private server: Server;

    constructor() {
        this.server = new Server({
            name: 'rust-assistant',
            version: '0.2.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });

        this.setupHandlers();
    }

    private setupHandlers() {
        // Configure middleware on transport
        this.server.transport.use((request: any) => {
            return request;
        });

        // Setup tool handlers
        this.server.setRequestHandler('listTools', async () => ({
            tools: []
        }));

        // Setup resource handlers
        this.server.setRequestHandler('listResources', async () => ({
            resources: []
        }));
    }
}
