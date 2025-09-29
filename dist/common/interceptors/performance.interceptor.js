"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PerformanceInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let PerformanceInterceptor = PerformanceInterceptor_1 = class PerformanceInterceptor {
    constructor() {
        this.logger = new common_1.Logger(PerformanceInterceptor_1.name);
        this.slowRequestThreshold = 1000;
        this.verySlowRequestThreshold = 5000;
        this.requestCounts = new Map();
        this.responseTimes = new Map();
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const correlationId = request.headers['x-correlation-id'];
        const startTime = process.hrtime.bigint();
        const startMemory = process.memoryUsage();
        const endpoint = `${request.method} ${request.route?.path || request.url}`;
        this.incrementRequestCount(endpoint);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const metrics = this.calculateMetrics(startTime, startMemory, request);
                this.logPerformanceMetrics(metrics, correlationId);
                this.trackResponseTime(endpoint, metrics.duration);
            },
            error: (error) => {
                const metrics = this.calculateMetrics(startTime, startMemory, request, error.status);
                this.logPerformanceMetrics(metrics, correlationId, true);
                this.trackResponseTime(endpoint, metrics.duration);
            },
        }));
    }
    calculateMetrics(startTime, startMemory, request, statusCode) {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000;
        const currentMemory = process.memoryUsage();
        const memoryUsage = {
            rss: currentMemory.rss - startMemory.rss,
            heapTotal: currentMemory.heapTotal - startMemory.heapTotal,
            heapUsed: currentMemory.heapUsed - startMemory.heapUsed,
            external: currentMemory.external - startMemory.external,
            arrayBuffers: currentMemory.arrayBuffers - startMemory.arrayBuffers,
        };
        return {
            duration,
            memoryUsage,
            isSlowRequest: duration > this.slowRequestThreshold,
            endpoint: `${request.method} ${request.route?.path || request.url}`,
            method: request.method,
            statusCode,
        };
    }
    logPerformanceMetrics(metrics, correlationId, isError = false) {
        const { duration, memoryUsage, endpoint, isSlowRequest } = metrics;
        const logData = {
            type: 'PERFORMANCE',
            correlationId,
            metrics: {
                duration: Math.round(duration * 100) / 100,
                memoryDelta: {
                    rss: this.formatBytes(memoryUsage.rss),
                    heapUsed: this.formatBytes(memoryUsage.heapUsed),
                },
                endpoint,
                isSlowRequest,
                isVerySlowRequest: duration > this.verySlowRequestThreshold,
            },
            timestamp: new Date().toISOString(),
        };
        if (duration > this.verySlowRequestThreshold || isError) {
            this.logger.error(`Very slow request: ${endpoint} took ${Math.round(duration)}ms`, logData);
        }
        else if (isSlowRequest) {
            this.logger.warn(`Slow request: ${endpoint} took ${Math.round(duration)}ms`, logData);
        }
        else {
            this.logger.debug(`Request performance: ${endpoint} - ${Math.round(duration)}ms`, logData);
        }
        if (memoryUsage.heapUsed > 50 * 1024 * 1024) {
            this.logger.warn(`High memory usage detected for ${endpoint}`, {
                type: 'MEMORY_ALERT',
                correlationId,
                memoryUsage: this.formatBytes(memoryUsage.heapUsed),
                endpoint,
            });
        }
    }
    incrementRequestCount(endpoint) {
        const currentCount = this.requestCounts.get(endpoint) || 0;
        this.requestCounts.set(endpoint, currentCount + 1);
    }
    trackResponseTime(endpoint, duration) {
        const times = this.responseTimes.get(endpoint) || [];
        times.push(duration);
        if (times.length > 100) {
            times.shift();
        }
        this.responseTimes.set(endpoint, times);
        if (times.length % 50 === 0) {
            this.logEndpointStatistics(endpoint, times);
        }
    }
    logEndpointStatistics(endpoint, responseTimes) {
        const sortedTimes = [...responseTimes].sort((a, b) => a - b);
        const avg = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
        const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
        const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
        this.logger.log(`Endpoint statistics for ${endpoint}`, {
            type: 'ENDPOINT_STATS',
            endpoint,
            statistics: {
                requestCount: this.requestCounts.get(endpoint),
                averageTime: Math.round(avg),
                p50: Math.round(p50),
                p90: Math.round(p90),
                p95: Math.round(p95),
                slowRequests: responseTimes.filter(t => t > this.slowRequestThreshold).length,
                verySlowRequests: responseTimes.filter(t => t > this.verySlowRequestThreshold).length,
            },
            timestamp: new Date().toISOString(),
        });
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
        return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
    }
};
exports.PerformanceInterceptor = PerformanceInterceptor;
exports.PerformanceInterceptor = PerformanceInterceptor = PerformanceInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], PerformanceInterceptor);
//# sourceMappingURL=performance.interceptor.js.map