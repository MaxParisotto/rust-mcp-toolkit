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
        server.setRequestHandler('validate', (request) => __awaiter(this, void 0, void 0, function* () {
            // Example validation logic
            if (!request.params.arguments || typeof request.params.arguments !== 'object') {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Invalid arguments');
            }
            const { input } = request.params.arguments;
            if (typeof input !== 'string') {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Input must be a string');
            }
            // Perform validation
            if (!input.trim()) {
                throw new server_1.McpError(server_1.ErrorCode.InvalidRequest, 'Input cannot be empty');
            }
            return { result: 'Validation successful' };
        }));
    });
}
