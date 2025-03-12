import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

interface QdrantStoreArguments {
  information: string;
  metadata?: Record<string, unknown>;
}

interface QdrantFindArguments {
  query: string;
}

function isQdrantStoreArguments(args: any): args is QdrantStoreArguments {
  return typeof args === 'object' && args !== null && 'information' in args;
}

function isQdrantFindArguments(args: any): args is QdrantFindArguments {
  return typeof args === 'object' && args !== null && 'query' in args;
}

class RustAssistantServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'rust-assistant-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {
            qdrant_store: {
              description: "Store data in Qdrant DB",
              inputSchema: {
                type: "object",
                properties: {
                  information: {
                    title: "Information",
                    type: "string"
                  },
                  metadata: {
                    default: null,
                    title: "Metadata",
                    type: "object"
                  }
                },
                required: [
                  "information"
                ],
                title: "storeArguments"
              }
            },
            qdrant_find: {
              description: "Find data in Qdrant DB",
              inputSchema: {
                type: "object",
                properties: {
                  query: {
                    title: "Query",
                    type: "string"
                  }
                },
                required: [
                  "query"
                ],
                title: "findArguments"
              }
            }
          }
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'qdrant_store') {
        const args = request.params.arguments;
        if (!isQdrantStoreArguments(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid arguments for qdrant_store: ${JSON.stringify(args)}`
          );
        }
        const { information, metadata } = args;
        // Implement logic to store data in Qdrant DB
        console.log(`Storing information: ${information} with metadata: ${JSON.stringify(metadata)}`);
        // Simulate storing data
        return {
          content: [
            {
              type: 'text',
              text: `Information stored successfully.`
            }
          ]
        };
      } else if (request.params.name === 'qdrant_find') {
        const args = request.params.arguments;
        if (!isQdrantFindArguments(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid arguments for qdrant_find: ${JSON.stringify(args)}`
          );
        }
        const { query } = args;
        // Implement logic to find data in Qdrant DB
        console.log(`Finding information with query: ${query}`);
        // Simulate finding data
        return {
          content: [
            {
              type: 'text',
              text: `Found information for query: ${query}`
            }
          ]
        };
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rust MCP server running on stdio');
  }
}

const server = new RustAssistantServer();
server.run().catch(console.error);
export { RustAssistantServer };
