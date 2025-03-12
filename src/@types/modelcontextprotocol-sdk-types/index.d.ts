declare module '@modelcontextprotocol/sdk/types' {
  export class McpError extends Error {
    constructor(message: string);
  }
}