"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
let MemoryHealthIndicator = class MemoryHealthIndicator extends terminus_1.HealthIndicator {
    constructor() {
        super(...arguments);
        this.memoryThreshold = 512 * 1024 * 1024;
    }
    async isHealthy(key) {
        const memoryUsage = process.memoryUsage();
        const isHealthy = memoryUsage.heapUsed < this.memoryThreshold;
        const result = this.getStatus(key, isHealthy, {
            heapUsed: this.formatBytes(memoryUsage.heapUsed),
            heapTotal: this.formatBytes(memoryUsage.heapTotal),
            rss: this.formatBytes(memoryUsage.rss),
            threshold: this.formatBytes(this.memoryThreshold),
            usage: `${Math.round((memoryUsage.heapUsed / this.memoryThreshold) * 100)}%`,
        });
        if (isHealthy) {
            return result;
        }
        throw new terminus_1.HealthCheckError('Memory Health Check Failed - Memory usage too high', result);
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
    }
};
exports.MemoryHealthIndicator = MemoryHealthIndicator;
exports.MemoryHealthIndicator = MemoryHealthIndicator = __decorate([
    (0, common_1.Injectable)()
], MemoryHealthIndicator);
//# sourceMappingURL=memory.health.js.map