import { Server, StdioServerTransport } from '@modelcontextprotocol/sdk/server';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types';
import { setupToolHandlers } from './handlers/toolHandlers';

class RustAssistantServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'rust-assistant-server',
        version: '0.1.0',
      },
      {
        resources: {},
        tools: {},
      }
    );

    setupToolHandlers(this.server);

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rust Assistant MCP server running on stdio');
  }

  async handleProcessOutput(process: any, output: string): Promise<{ content: { text: string } }> {
    // Placeholder for handling process output
    return { content: { text: `Handling process output: ${output}` } };
  }

  async generateErrorFixes(errorCode: string, context: string): Promise<{ suggestedFix: string }> {
    // Placeholder for generating error fixes
    return { suggestedFix: `Generated fix for error code ${errorCode} with context: ${context}` };
  }

  async handleToolRequest(request: any): Promise<any> {
    if (!request.params.arguments || typeof request.params.arguments !== 'object') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
    }

    const { toolName, arguments: args } = request.params.arguments as { toolName: string; arguments: any };

    if (typeof toolName !== 'string' || !args) {
      throw new McpError(ErrorCode.InvalidRequest, 'Tool name must be a string and arguments must be provided');
    }

    // Placeholder for handling tool requests
    console.log(`Handling tool request for ${toolName} with args:`, args);
    return { content: ['Tool request handled successfully'] };
  }
}

const server = new RustAssistantServer();
server.run().catch(console.error);

export { RustAssistantServer };
