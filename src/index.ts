import { Server, StdioServerTransport } from '@modelcontextprotocol/sdk/dist/cjs/server';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/dist/cjs/types';

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
          tools: {},
        },
      }
    );

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  public run() {
    const transport = new StdioServerTransport();
    this.server.connect(transport).catch(console.error);
    console.error('Rust Assistant MCP server running on stdio');
  }
}

export { RustAssistantServer };
