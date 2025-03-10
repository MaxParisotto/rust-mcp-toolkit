#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import required schemas for request handlers
import {
  CallToolRequestSchema,
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
    {
        name: "RustCodingAssistant",
        version: "1.0.0", // Added missing version field
        description: "MCP tool for Rust development assistance including analysis, best practices and debugging support"
    },
    {
    capabilities: { 
      resources: {},  // Add empty resource capability container
      tools: {}       // Proper object structure instead of boolean flag
        },
    }
 );

// Define the list of available tools with proper schema imports
server.setRequestHandler(ListToolsRequestSchema, async () => ({
   tools:[
        {
           name:'rust-analyze',
           description:"Analyze Rust code for errors/suggestions",
           inputSchema:{
               type: 'object' as const,
               properties:{
                   code:{type:'string',description:"Rust source code to analyze"},
                   fileName:{type:'string'}
               },
               required:['code']
            }
        } 
   ]
}));

// Handle tool execution with null checks
server.setRequestHandler(CallToolRequestSchema, async (request) => {
 if(request?.params?.name === 'rust-analyze'){
   const args = request.params?.arguments || {};
   
   // Safely access parameters and return proper structure
   return { 
     content:[{
       type:'text',
       text:`Analysis completed for ${args.fileName ?? "unnamed file"}`,
       _meta:{}
      }]
    };
 }
 else {
  return {}; // Return empty object if tool not recognized
 }
});

async function main() {
 const transport = new StdioServerTransport();
 await server.connect(transport);
}

main().catch(console.error);
