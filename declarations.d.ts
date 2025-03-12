// declarations.d.ts

declare module '@modelcontextprotocol/sdk/server' {
  export class Server {
    constructor(
      config: { name: string; version: string },
      capabilities: { resources: {}; tools: {} }
    );

    setRequestHandler<T>(schema: T, handler: (request: any) => Promise<any>): void;
    connect(transport: any): Promise<void>;
    close(): Promise<void>;
    onerror: (error: any) => void;
  }

  export class StdioServerTransport {}

  export class McpError {
    code: string;
    message: string;

    constructor(code: string, message: string);
  }

  export enum ErrorCode {
    InternalError = 'INTERNAL_ERROR',
    InvalidRequest = 'INVALID_REQUEST',
    MethodNotFound = 'METHOD_NOT_FOUND',
  }
}

declare module '@modelcontextprotocol/sdk/types' {
  export class McpError {
    code: string;
    message: string;

    constructor(code: string, message: string);
  }

  export enum ErrorCode {
    InternalError = 'INTERNAL_ERROR',
    InvalidRequest = 'INVALID_REQUEST',
    MethodNotFound = 'METHOD_NOT_FOUND',
  }

  // Assuming RequestHandlerExtra is a type that needs to be defined
  export interface RequestHandlerExtra {}
}