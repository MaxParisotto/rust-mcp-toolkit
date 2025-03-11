#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport, WebSocketServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import Ajv from 'ajv';
import { 
  Request,
  Tool,
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

class RustAssistantServer {
  private server: Server;
  private tools: Tool[] = [];
  private errorHandlers: any[] = [];
  private ajv: any;

  constructor() {
    this.server = new Server(
      {
        name: 'rust-assistant',
        version: '0.2.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.ajv = new Ajv();
    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupValidationMiddleware();
    this.setupErrorHandlers();

    // Define tools
    this.tools.push({
      name: 'rust_playground',
      description: 'Execute Rust code snippets in a sandboxed environment',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The Rust code to execute'
          },
          edition: {
            type: 'string',
            enum: ['2015', '2018', '2021'],
            description: 'Rust edition to use',
            default: '2021'
          },
          crates: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Additional crates to include'
          }
        },
        required: ['code']
      }
    });

    this.tools.push({
      name: 'profile_performance',
      description: 'Profile Rust code performance',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The Rust code to profile'
          },
          profileType: {
            type: 'string',
            enum: ['cpu', 'memory', 'io'],
            description: 'Type of profiling to perform'
          }
        },
        required: ['code']
      }
    });

    this.tools.push({
      name: 'cross_compile',
      description: 'Cross-compile Rust code for different targets',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The Rust code to compile'
          },
          target: {
            type: 'string',
            description: 'Target triple (e.g. x86_64-unknown-linux-gnu)'
          }
        },
        required: ['code', 'target']
      }
    });
  }

  private async generateRustSuggestions(code: string): Promise<Array<{
    type: string;
    message: string;
    severity: string;
    example?: string;
  }>> {
    const suggestions: Array<{
      type: string;
      message: string;
      severity: string;
      example?: string;
    }> = [];
    
    // Check for unwrap() usage
    if (code.includes('.unwrap()')) {
      suggestions.push({
        type: 'error_handling',
        message: 'Consider using proper error handling with Result or Option instead of unwrap()',
        severity: 'warning',
        example: `// Instead of:
let value = some_result.unwrap();

// Use:
let value = some_result?; // or match/if let for more control`
      });
    }

    // Check for clone() usage
    if (code.includes('.clone()')) {
      suggestions.push({
        type: 'performance',
        message: 'Avoid unnecessary cloning - consider using references or Rc/Arc if shared ownership is needed',
        severity: 'warning'
      });
    }

    // Check for missing documentation
    if (!code.includes('///')) {
      suggestions.push({
        type: 'documentation',
        message: 'Add documentation comments using /// for public items',
        severity: 'info'
      });
    }

    return suggestions;
  }

  private async analyzeMacroHygiene(code: string): Promise<Array<{
    type: string;
    message: string;
    severity: string;
    example?: string;
    location?: { line: number, column: number };
  }>> {
    const issues: Array<{
      type: string;
      message: string;
      severity: string;
      example?: string;
      location?: { line: number, column: number };
    }> = [];

    // Check for common macro hygiene issues
    const macroPatterns = [
      { 
        pattern: /macro_rules!\s+\w+\s*\{/,
        message: 'Macro definition should use proper hygiene practices',
        severity: 'warning',
        example: `// Use $crate:: for absolute paths in macros
macro_rules! my_macro {
    ($x:expr) => {
        $crate::some_function($x)
    }
}`
      },
      {
        pattern: /(\$[a-zA-Z_]\w*):(ident|expr|ty|pat|path|tt)/,
        message: 'Macro variables should use proper hygiene practices',
        severity: 'warning',
        example: `// Use $crate:: for absolute paths in macros
macro_rules! my_macro {
    ($x:expr) => {
        $crate::some_function($x)
    }
}`
      }
    ];

    for (const {pattern, message, severity, example} of macroPatterns) {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        const location = this.findCodeLocation(code, match[0]);
        issues.push({
          type: 'macro_hygiene',
          message,
          severity,
          example,
          location
        });
      }
    }

    return issues;
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_rust',
          description: 'Analyze Rust code for errors and warnings',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' }
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
              code: { type: 'string', description: 'Rust source code to improve' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'profile_performance',
          description: 'Analyze and profile Rust code performance',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to profile' },
              fileName: { type: 'string', description: 'Name of the source file' },
              profileType: {
                type: 'string',
                enum: ['cpu', 'memory', 'io'],
                description: 'Type of profiling to perform'
              }
            },
            required: ['code', 'profileType']
          }
        },
        {
          name: 'analyze_memory_safety',
          description: 'Check for memory safety issues in Rust code',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'async_pattern_advisor',
          description: 'Provide guidance on async/await patterns',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              runtime: {
                type: 'string',
                enum: ['tokio', 'async-std', 'smol'],
                description: 'Async runtime being used'
              }
            },
            required: ['code']
          }
        },
        {
          name: 'manage_dependencies',
          description: 'Manage and optimize Cargo dependencies',
          inputSchema: {
            type: 'object',
            properties: {
              cargoToml: { type: 'string', description: 'Contents of Cargo.toml' }
            },
            required: ['cargoToml']
          }
        },
        {
          name: 'format_code',
          description: 'Format Rust code using rustfmt',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to format' },
              fileName: { type: 'string', description: 'Name of the source file' },
              config: {
                type: 'object',
                description: 'rustfmt configuration options'
              }
            },
            required: ['code']
          }
        },
        {
          name: 'lint_code',
          description: 'Lint Rust code using Clippy',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to lint' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'visualize_lifetimes',
          description: 'Visualize and explain lifetime relationships',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'expand_macros',
          description: 'Expand and explain Rust macros',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code with macros' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'analyze_test_coverage',
          description: 'Analyze test coverage of Rust code',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              tests: { type: 'string', description: 'Test code' }
            },
            required: ['code', 'tests']
          }
        },
        {
          name: 'run_benchmarks',
          description: 'Run and analyze benchmarks',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust benchmark code' },
              fileName: { type: 'string', description: 'Name of the source file' },
              iterations: {
                type: 'number',
                description: 'Number of benchmark iterations',
                minimum: 1
              }
            },
            required: ['code', 'iterations']
          }
        },
        {
          name: 'analyze_macro_hygiene',
          description: 'Analyze macro hygiene and potential issues',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code with macros' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'visualize_borrow_checker',
          description: 'Visualize borrow checker rules and relationships',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' }
            },
            required: ['code']
          }
        },
        {
          name: 'visualize_ownership',
          description: 'Generate ownership and borrowing diagrams',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              depth: {
                type: 'number',
                description: 'Depth of ownership chain to visualize',
                minimum: 1,
                maximum: 10
              }
            },
            required: ['code']
          }
        },
        {
          name: 'debug_async_tasks',
          description: 'Debug and visualize async task execution',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              runtime: {
                type: 'string',
                enum: ['tokio', 'async-std', 'smol'],
                description: 'Async runtime being used'
              }
            },
            required: ['code', 'runtime']
          }
        },
        {
          name: 'generate_tests',
          description: 'Generate test cases based on code analysis',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              testFramework: {
                type: 'string',
                enum: ['standard', 'proptest', 'quickcheck'],
                description: 'Test framework to use'
              }
            },
            required: ['code']
          }
        },
        {
          name: 'analyze_dependencies',
          description: 'Analyze and visualize dependency relationships',
          inputSchema: {
            type: 'object',
            properties: {
              cargoToml: { type: 'string', description: 'Contents of Cargo.toml' },
              depth: {
                type: 'number',
                description: 'Depth of dependency tree to analyze',
                minimum: 1,
                maximum: 5
              }
            },
            required: ['cargoToml']
          }
        },
        {
          name: 'compile_to_wasm',
          description: 'Compile Rust code to WebAssembly',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to compile' },
              fileName: { type: 'string', description: 'Name of the source file' },
              optimize: {
                type: 'boolean',
                description: 'Enable WebAssembly optimization',
                default: true
              }
            },
            required: ['code']
          }
        },
        {
          name: 'analyze_ffi',
          description: 'Analyze and optimize FFI (Foreign Function Interface) code',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust FFI code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              targetLanguage: {
                type: 'string',
                enum: ['c', 'cpp', 'python', 'nodejs'],
                description: 'Target language for FFI'
              }
            },
            required: ['code', 'targetLanguage']
          }
        },
        {
          name: 'embedded_analysis',
          description: 'Analyze Rust code for embedded systems',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to analyze' },
              fileName: { type: 'string', description: 'Name of the source file' },
              target: {
                type: 'string',
                description: 'Embedded target (e.g. armv7, riscv32)'
              }
            },
            required: ['code', 'target']
          }
        },
        {
          name: 'audit_unsafe',
          description: 'Audit and analyze unsafe Rust code',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Rust source code to audit' },
              fileName: { type: 'string', description: 'Name of the source file' },
              strict: {
                type: 'boolean',
                description: 'Enable strict unsafe checking',
                default: true
              }
            },
            required: ['code']
          }
        }
      ]
    }));
  }

  private setupResourceHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'rust://reference/common-errors',
          name: 'Rust Common Errors',
          description: 'Reference guide to common Rust compiler errors and how to fix them',
          mimeType: 'application/json'
        },
        {
          uri: 'rust://guide/best-practices',
          name: 'Rust Best Practices',
          description: 'Guide to idiomatic Rust coding practices and patterns',
          mimeType: 'application/json'
        },
        {
          uri: 'rust://reference/lifetimes',
          name: 'Rust Lifetime Reference',
          description: 'Guide to understanding Rust\'s lifetime system',
          mimeType: 'application/json'
        },
        {
          uri: 'rust://reference/wasm',
          name: 'WebAssembly Reference',
          description: 'Guide to Rust WebAssembly compilation and optimization',
          mimeType: 'application/json'
        },
        {
          uri: 'rust://guide/embedded',
          name: 'Embedded Rust Guide',
          description: 'Best practices for Rust in embedded systems',
          mimeType: 'application/json'
        },
        {
          uri: 'rust://guide/ffi',
          name: 'FFI Best Practices',
          description: 'Patterns and techniques for Rust FFI',
          mimeType: 'application/json'
        }
      ]
    }));

    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
      resourceTemplates: [
        {
          uriTemplate: 'rust://error/{errorCode}',
          name: 'Rust Error Explanation',
          description: 'Detailed explanation of specific Rust error codes',
          mimeType: 'application/json'
        },
        {
          uriTemplate: 'rust://pattern/{patternName}',
          name: 'Rust Pattern Reference',
          description: 'Examples and explanations of common Rust patterns',
          mimeType: 'application/json'
        },
        {
          uriTemplate: 'rust://concurrency/{patternName}',
          name: 'Concurrency Pattern Reference',
          description: 'Examples and explanations of Rust concurrency patterns',
          mimeType: 'application/json'
        },
        {
          uriTemplate: 'rust://unsafe/{patternName}',
          name: 'Unsafe Code Patterns',
          description: 'Examples and explanations of unsafe code patterns',
          mimeType: 'application/json'
        }
      ]
    }));
  }

  private setupValidationMiddleware(): void {
    (this.server as any).use(async (request: Request, next: Function) => {
      try {
        // Validate input schemas
        if (request.params?.arguments) {
          const tool = (this.server as any).tools.find((t: any) => request.params && t.name === request.params.name);
          if (tool) {
            const validate = this.ajv.compile(tool.inputSchema);
            if (!validate(request.params.arguments)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                `Invalid arguments: ${JSON.stringify(validate.errors)}`
              );
            }
          }
        }
        return await next();
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        if (error instanceof Error) {
          throw new McpError(
            ErrorCode.InternalError,
            error.message,
            error.stack
          );
        }
        throw new McpError(
          ErrorCode.InternalError,
          'Unknown error occurred'
        );
      }
    });
  }

  private setupErrorHandlers(): void {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      console.error({
        code: ErrorCode.InternalError,
        message: `Uncaught exception: ${error.message}`,
        stack: error.stack
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      console.error({
        code: ErrorCode.InternalError,
        message: `Unhandled rejection: ${reason}`,
        stack: new Error().stack
      });
    });
  }

  async run(): Promise<void> {
    const transportType = process.env.TRANSPORT || 'stdio';
    let transport;

    if (transportType === 'stdio') {
      transport = new StdioServerTransport();
    } else {
      transport = new WebSocketServerTransport({ port: 3000 });
    }

    await this.server.connect(transport);
    console.log(`Rust Assistant MCP server running on ${transportType}`);
  }
}

const server = new RustAssistantServer();
server.run().catch(console.error);
