import { Server, McpError, ErrorCode } from '@modelcontextprotocol/sdk/server';

export async function setupToolHandlers(server: Server): Promise<void> {
  server.setRequestHandler('get_forecast', async (request) => {
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

  server.setRequestHandler('store_data', async (request) => {
    if (!request.params.arguments || typeof request.params.arguments !== 'object') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
    }

    const { collectionName, data } = request.params.arguments as { collectionName: string; data: any };

    if (typeof collectionName !== 'string' || !data) {
      throw new McpError(ErrorCode.InvalidRequest, 'Collection name must be a string and data must be provided');
    }

    // Example logic to store data
    await storeData(collectionName, data);
    return { content: ['Data stored successfully'] };
  });

  server.setRequestHandler('query_data', async (request) => {
    if (!request.params.arguments || typeof request.params.arguments !== 'object') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid arguments');
    }

    const { collectionName, query } = request.params.arguments as { collectionName: string; query: any };

    if (typeof collectionName !== 'string' || !query) {
      throw new McpError(ErrorCode.InvalidRequest, 'Collection name must be a string and query must be provided');
    }

    // Example logic to query data
    const results = await queryData(collectionName, query);
    return { content: [results] };
  });
}

async function getWeatherForecast(city: string, days?: number): Promise<string> {
  // Placeholder for actual weather forecast retrieval logic
  return `Weather forecast for ${city} over the next ${days || 3} days`;
}

async function storeData(collectionName: string, data: any): Promise<void> {
  // Placeholder for actual data storage logic
  console.log(`Storing data in collection ${collectionName}:`, data);
}

async function queryData(collectionName: string, query: any): Promise<any> {
  // Placeholder for actual data querying logic
  console.log(`Querying data from collection ${collectionName} with query:`, query);
  return { results: [] };
}
