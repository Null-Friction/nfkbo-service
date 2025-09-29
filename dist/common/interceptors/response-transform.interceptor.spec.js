"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const response_transform_interceptor_1 = require("./response-transform.interceptor");
describe('ResponseTransformInterceptor', () => {
    let interceptor;
    let mockExecutionContext;
    let mockCallHandler;
    beforeEach(() => {
        interceptor = new response_transform_interceptor_1.ResponseTransformInterceptor();
        const mockRequest = {
            headers: {
                'x-correlation-id': 'test-correlation-id',
            },
        };
        mockExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        };
        mockCallHandler = {
            handle: jest.fn(),
        };
    });
    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });
    it('should transform simple data to standard response format', (done) => {
        const testData = { id: 1, name: 'test' };
        mockCallHandler.handle.mockReturnValue((0, rxjs_1.of)(testData));
        interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .subscribe((result) => {
            expect(result).toEqual({
                success: true,
                data: testData,
                meta: {
                    timestamp: expect.any(String),
                    requestId: 'test-correlation-id',
                    responseTime: expect.any(Number),
                },
            });
            done();
        });
    });
    it('should handle null data', (done) => {
        mockCallHandler.handle.mockReturnValue((0, rxjs_1.of)(null));
        interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .subscribe((result) => {
            expect(result).toEqual({
                success: true,
                data: null,
                meta: {
                    timestamp: expect.any(String),
                    requestId: 'test-correlation-id',
                    responseTime: expect.any(Number),
                },
            });
            done();
        });
    });
    it('should not transform data already in standard format', (done) => {
        const standardData = {
            success: true,
            data: { id: 1 },
            meta: {
                timestamp: '2023-01-01T00:00:00.000Z',
                requestId: 'existing-id',
            },
        };
        mockCallHandler.handle.mockReturnValue((0, rxjs_1.of)(standardData));
        interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .subscribe((result) => {
            expect(result).toEqual(standardData);
            done();
        });
    });
    it('should handle array data', (done) => {
        const arrayData = [{ id: 1 }, { id: 2 }];
        mockCallHandler.handle.mockReturnValue((0, rxjs_1.of)(arrayData));
        interceptor
            .intercept(mockExecutionContext, mockCallHandler)
            .subscribe((result) => {
            expect(result).toEqual({
                success: true,
                data: arrayData,
                meta: {
                    timestamp: expect.any(String),
                    requestId: 'test-correlation-id',
                    responseTime: expect.any(Number),
                },
            });
            done();
        });
    });
});
//# sourceMappingURL=response-transform.interceptor.spec.js.map