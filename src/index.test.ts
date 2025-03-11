import { RustAssistantServer } from './index.js';
import { McpError } from '@modelcontextprotocol/sdk/types';
import { spawn } from 'child_process';
import fs from 'fs/promises';

describe('RustAssistantServer', () => {
  let server: RustAssistantServer;

  beforeAll(() => {
    server = new RustAssistantServer();
  });

  describe('handleProcessOutput', () => {
    it('should resolve with output for successful process', async () => {
      const mockProcess = spawn('echo', ['test output']);
      const result = await server['handleProcessOutput'](mockProcess, 'Test');
      expect(result.content.text).toContain('test output');
    });

    it('should reject with error for failed process', async () => {
      const mockProcess = spawn('false');
      await expect(server['handleProcessOutput'](mockProcess, 'Test'))
        .rejects.toThrow(McpError);
    });

    it('should timeout for long-running process', async () => {
      const mockProcess = spawn('sleep', ['60']);
      await expect(server['handleProcessOutput'](mockProcess, 'Test'))
        .rejects.toThrow('timed out');
      mockProcess.kill();
    });
  });

  describe('generateErrorFixes', () => {
    it('should return fix for valid error code', async () => {
      const result = await server['generateErrorFixes']('E0382', '');
      expect(result.suggestedFix).toBeDefined();
    });

    it('should throw for invalid error code format', async () => {
      await expect(server['generateErrorFixes']('INVALID', ''))
        .rejects.toThrow(McpError);
    });
  });

  describe('tool handlers', () => {
    it('should analyze Rust code', async () => {
      const code = `fn main() {}`;
      const tempFile = '/tmp/test.rs';
      await fs.writeFile(tempFile, code);
      
      const result = await server['handleToolRequest']({
        name: 'analyze_rust',
        arguments: { code, fileName: 'test.rs' }
      });
      
      expect(result.content.text).toContain('Analyzing');
      await fs.unlink(tempFile);
    });
  });
});
