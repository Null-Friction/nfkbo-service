import { MemoryHealthIndicator } from './memory.health';

describe('MemoryHealthIndicator', () => {
  let healthIndicator: MemoryHealthIndicator;

  beforeEach(() => {
    healthIndicator = new MemoryHealthIndicator();
  });

  it('should be defined', () => {
    expect(healthIndicator).toBeDefined();
  });

  it('should return healthy status when memory usage is below threshold', async () => {
    // Mock low memory usage
    const mockMemoryUsage = jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 50 * 1024 * 1024, // 50MB
      heapTotal: 30 * 1024 * 1024, // 30MB
      heapUsed: 20 * 1024 * 1024, // 20MB (well below 512MB threshold)
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
    // Mock high memory usage
    const mockMemoryUsage = jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 600 * 1024 * 1024, // 600MB
      heapTotal: 550 * 1024 * 1024, // 550MB
      heapUsed: 600 * 1024 * 1024, // 600MB (above 512MB threshold)
      external: 10 * 1024 * 1024,
      arrayBuffers: 5 * 1024 * 1024,
    });

    await expect(healthIndicator.isHealthy('memory')).rejects.toThrow();

    mockMemoryUsage.mockRestore();
  });
});