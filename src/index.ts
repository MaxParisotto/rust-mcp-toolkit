#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class RustAssistantServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'rust-assistant',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_rust',
          description: 'Analyze Rust code for errors and warnings',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'Rust source code to analyze'
              },
              fileName: {
                type: 'string',
                description: 'Name of the source file'
              }
            },
            required: ['code']
          }
        },
        {
          name: 'suggest_improvements',
          description: 'Suggest improvements for Rust code',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'Rust source code to improve'
              },
              fileName: {
                type: 'string',
                description: 'Name of the source file'
              }
            },
            required: ['code']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'analyze_rust':
          return this.handleRustAnalysis(request.params.arguments);
        case 'suggest_improvements':
          return this.handleRustSuggestions(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async handleRustAnalysis(args: any) {
    // TODO: Implement Rust code analysis using rust-analyzer
    return {
      content: [{
        type: 'text',
        text: 'Rust analysis not yet implemented'
      }]
    };
  }

  private async handleRustSuggestions(args: any) {
    // TODO: Implement Rust code suggestions
    return {
      content: [{
        type: 'text',
        text: 'Rust suggestions not yet implemented'
      }]
    };
  }

  private setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: []
    }));

    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
      resourceTemplates: []
    }));
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rust Assistant MCP server running on stdio');
  }
}

const server = new RustAssistantServer();
server.run().catch(console.error);
