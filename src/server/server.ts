import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { storeDocument, searchSimilarDocuments } from '../services/qdrant.js';
import { z } from 'zod';

const ForecastRequestSchema = z.object({
  method: z.literal('get_forecast'),
  params: z.object({
    arguments: z.object({
      city: z.string(),
      days: z.number().optional()
    })
  })
});

const StoreDataRequestSchema = z.object({
  method: z.literal('store_data'),
  params: z.object({
    arguments: z.object({
      collectionName: z.string(),
      data: z.any()
    })
  })
});

const QueryDataRequestSchema = z.object({
  method: z.literal('query_data'),
  params: z.object({
    arguments: z.object({
      collectionName: z.string(),
      query: z.any()
    })
  })
});

export async function setupToolHandlers(server: Server): Promise<void> {
  server.setRequestHandler(ForecastRequestSchema, async (request) => {
    if (!request.params.arguments || typeof request.params.arguments !== 'object') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
    }

    const { city, days } = request.params.arguments as { city: string; days?: number };

    if (typeof city !== 'string' || (days && typeof days !== 'number')) {
      throw new McpError(ErrorCode.InvalidRequest, 'City must be a string and days must be a number');
    }

    // Example logic to get weather forecast
    const forecast = await getWeatherForecast(city, days);
    return { content: [forecast] };
  });

  server.setRequestHandler(StoreDataRequestSchema, async (request) => {
    if (!request.params.arguments || typeof request.params.arguments !== 'object') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
    }

    const { collectionName, data } = request.params.arguments as { collectionName: string; data: any };

    if (typeof collectionName !== 'string' || !data) {
      throw new McpError(ErrorCode.InvalidRequest, 'Collection name must be a string and data must be provided');
    }

    // Store data in Qdrant
    await storeDocument(`Data for ${collectionName}`, data);
    return { content: ['Data stored successfully'] };
  });

  server.setRequestHandler(QueryDataRequestSchema, async (request) => {
    if (!request.params.arguments || typeof request.params.arguments !== 'object') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
    }

    const { collectionName, query } = request.params.arguments as { collectionName: string; query: any };

    if (typeof collectionName !== 'string' || !query) {
      throw new McpError(ErrorCode.InvalidRequest, 'Collection name must be a string and query must be provided');
    }

    // Query data from Qdrant
    const results = await searchSimilarDocuments(query.vector, query.limit);
    return { content: [results] };
  });
}

async function getWeatherForecast(city: string, days?: number): Promise<string> {
  // Placeholder for actual weather forecast retrieval logic
  return `Weather forecast for ${city} over the next ${days || 3} days`;
}
