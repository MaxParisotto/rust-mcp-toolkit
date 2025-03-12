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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const types_1 = require("@modelcontextprotocol/sdk/types");
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
describe('RustAssistantServer', () => {
    let server;
    beforeAll(() => {
        server = new index_js_1.RustAssistantServer();
    });
    describe('handleProcessOutput', () => {
        it('should resolve with output for successful process', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProcess = (0, child_process_1.spawn)('echo', ['test output']);
            const result = yield server['handleProcessOutput'](mockProcess, 'Test');
            expect(result.content.text).toContain('test output');
        }));
        it('should reject with error for failed process', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProcess = (0, child_process_1.spawn)('false');
            yield expect(server['handleProcessOutput'](mockProcess, 'Test'))
                .rejects.toThrow(types_1.McpError);
        }));
        it('should timeout for long-running process', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProcess = (0, child_process_1.spawn)('sleep', ['60']);
            yield expect(server['handleProcessOutput'](mockProcess, 'Test'))
                .rejects.toThrow('timed out');
            mockProcess.kill();
        }));
    });
    describe('generateErrorFixes', () => {
        it('should return fix for valid error code', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield server['generateErrorFixes']('E0382', '');
            expect(result.suggestedFix).toBeDefined();
        }));
        it('should throw for invalid error code format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(server['generateErrorFixes']('INVALID', ''))
                .rejects.toThrow(types_1.McpError);
        }));
    });
    describe('tool handlers', () => {
        it('should analyze Rust code', () => __awaiter(void 0, void 0, void 0, function* () {
            const code = `fn main() {}`;
            const tempFile = '/tmp/test.rs';
            yield promises_1.default.writeFile(tempFile, code);
            const result = yield server['handleToolRequest']({
                name: 'analyze_rust',
                arguments: { code, fileName: 'test.rs' }
            });
            expect(result.content.text).toContain('Analyzing');
            yield promises_1.default.unlink(tempFile);
        }));
    });
});
