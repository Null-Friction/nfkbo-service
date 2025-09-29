"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_health_1 = require("./memory.health");
describe('MemoryHealthIndicator', () => {
    let healthIndicator;
    beforeEach(() => {
        healthIndicator = new memory_health_1.MemoryHealthIndicator();
    });
    it('should be defined', () => {
        expect(healthIndicator).toBeDefined();
    });
    it('should return healthy status when memory usage is below threshold', async () => {
        const mockMemoryUsage = jest.spyOn(process, 'memoryUsage').mockReturnValue({
            rss: 50 * 1024 * 1024,
            heapTotal: 30 * 1024 * 1024,
            heapUsed: 20 * 1024 * 1024,
            external: 5 * 1024 * 1024,
            arrayBuffers: 2 * 1024 * 1024,
        });
        const result = await healthIndicator.isHealthy('memory');
        expect(result).toEqual({
            memory: {
                status: 'up',
                heapUsed: expect.any(String),
                heapTotal: expect.any(String),
                rss: expect.any(String),
                threshold: expect.any(String),
                usage: expect.any(String),
            },
        });
        mockMemoryUsage.mockRestore();
    });
    it('should throw HealthCheckError when memory usage is above threshold', async () => {
        const mockMemoryUsage = jest.spyOn(process, 'memoryUsage').mockReturnValue({
            rss: 600 * 1024 * 1024,
            heapTotal: 550 * 1024 * 1024,
            heapUsed: 600 * 1024 * 1024,
            external: 10 * 1024 * 1024,
            arrayBuffers: 5 * 1024 * 1024,
        });
        await expect(healthIndicator.isHealthy('memory')).rejects.toThrow();
        mockMemoryUsage.mockRestore();
    });
});
//# sourceMappingURL=memory.health.spec.js.map