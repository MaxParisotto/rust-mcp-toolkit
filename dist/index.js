import { Server, StdioServerTransport } from '@modelcontextprotocol/sdk/server';
import { McpError } from '@modelcontextprotocol/sdk/types'; // Adjusted import
import z from 'zod';
// Define ErrorCode locally if it is not exported from @modelcontextprotocol/sdk/types
const ErrorCode = {
    InvalidRequest: 'INVALID_REQUEST',
    InternalError: 'INTERNAL_ERROR'
};
export class MyServer {
    server;
    constructor() {
        this.server = new Server({
            name: 'example-weather-server',
            version: '0.1.0',
        }, {
            capabilities: {
                resources: {},
                tools: {}
            }
        });
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        const validateRequestSchema = z.object({
            method: z.literal('validate'),
            params: z.object({
                arguments: z.object({
                    information: z.string(),
                    metadata: z.any().optional()
                })
            })
        });
        this.server.setRequestHandler(validateRequestSchema, async (request) => {
            // Example validation logic
            const { information } = request.params.arguments;
            if (!information || typeof information !== 'string') {
                throw new McpError(`${ErrorCode.InvalidRequest}: Invalid arguments`);
            }
            // Perform validation
            if (!information.trim()) {
                throw new McpError(`${ErrorCode.InvalidRequest}: Input cannot be empty`);
            }
            return { result: 'Validation successful' };
        });
        const storeQdrantRequestSchema = z.object({
            method: z.literal('store_qdrant'),
            params: z.object({
                arguments: z.object({
                    information: z.string(),
                    metadata: z.any().optional()
                })
            })
        });
        this.server.setRequestHandler(storeQdrantRequestSchema, async (request) => {
            // Example logic to store data in Qdrant DB
            const { information } = request.params.arguments;
            if (!information || typeof information !== 'string') {
                throw new McpError(`${ErrorCode.InvalidRequest}: Information must be a string`);
            }
            try {
                // Logic to store data in Qdrant DB
                console.log('Storing information:', information);
                return { result: 'Data stored successfully' };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new McpError(`${ErrorCode.InternalError}: Failed to store data: ${error.message}`);
                }
                throw new McpError(`${ErrorCode.InternalError}: An unknown error occurred while storing data`);
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Weather MCP server running on stdio');
    }
}
const server = new MyServer();
server.setupToolHandlers();
server.run().catch(console.error);
