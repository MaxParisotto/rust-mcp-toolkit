"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToolHandlers = setupToolHandlers;
const server_1 = require("@modelcontextprotocol/sdk/server");
function setupToolHandlers(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.setRequestHandler('get_forecast', (request) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.arguments || typeof request.params.arguments !== 'object') {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Invalid arguments');
            }
            const { city, days } = request.params.arguments;
            if (typeof city !== 'string' || (days && typeof days !== 'number')) {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'City must be a string and days must be a number');
            }
            // Example logic to get weather forecast
            const forecast = yield getWeatherForecast(city, days);
            return { content: [forecast] };
        }));
        server.setRequestHandler('store_data', (request) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.arguments || typeof request.params.arguments !== 'object') {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Invalid arguments');
            }
            const { collectionName, data } = request.params.arguments;
            if (typeof collectionName !== 'string' || !data) {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Collection name must be a string and data must be provided');
            }
            // Example logic to store data
            yield storeData(collectionName, data);
            return { content: ['Data stored successfully'] };
        }));
        server.setRequestHandler('query_data', (request) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.arguments || typeof request.params.arguments !== 'object') {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Invalid arguments');
            }
            const { collectionName, query } = request.params.arguments;
            if (typeof collectionName !== 'string' || !query) {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Collection name must be a string and query must be provided');
            }
            // Example logic to query data
            const results = yield queryData(collectionName, query);
            return { content: [results] };
        }));
    });
}
function getWeatherForecast(city, days) {
    return __awaiter(this, void 0, void 0, function* () {
        // Placeholder for actual weather forecast retrieval logic
        return `Weather forecast for ${city} over the next ${days || 3} days`;
    });
}
function storeData(collectionName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Placeholder for actual data storage logic
        console.log(`Storing data in collection ${collectionName}:`, data);
    });
}
function queryData(collectionName, query) {
    return __awaiter(this, void 0, void 0, function* () {
        // Placeholder for actual data querying logic
        console.log(`Querying data from collection ${collectionName} with query:`, query);
        return { results: [] };
    });
}
