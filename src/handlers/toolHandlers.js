import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'; // Adjusted import
import { z } from 'zod';
// Define a Zod schema for the request
const validateRequestSchema = z.object({
    method: z.literal('validate'),
    params: z.object({
        arguments: z.object({
            information: z.string(),
            metadata: z.any().optional()
        })
    })
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
export async function setupToolHandlers(server) {
    server.setRequestHandler(validateRequestSchema, async (request) => {
        // Example validation logic
        const { information } = request.params.arguments; // Corrected property access
        if (!information || typeof information !== 'string') {
            throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
        }
        // Perform validation
        if (!information.trim()) {
            throw new McpError(ErrorCode.InvalidRequest, 'Input cannot be empty');
        }
        return { result: 'Validation successful' };
    });
    server.setRequestHandler(storeQdrantRequestSchema, async (request) => {
        // Example logic to store data in Qdrant DB
        const { information } = request.params.arguments; // Corrected property access
        if (!information || typeof information !== 'string') {
            throw new McpError(ErrorCode.InvalidRequest, 'Information must be a string');
        }
        try {
            // Logic to store data in Qdrant DB
            console.log('Storing information:', information);
            // Placeholder for actual storage logic
            return { result: 'Data stored successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new McpError(ErrorCode.InternalError, `Failed to store data: ${error.message}`);
            }
            throw new McpError(ErrorCode.InternalError, 'An unknown error occurred while storing data');
        }
    });
}
