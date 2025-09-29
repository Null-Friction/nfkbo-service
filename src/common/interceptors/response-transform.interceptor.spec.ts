import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseTransformInterceptor } from './response-transform.interceptor';

describe('ResponseTransformInterceptor', () => {
  let interceptor: ResponseTransformInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new ResponseTransformInterceptor();

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
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
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
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(null));

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
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

    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(standardData));

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe((result) => {
        expect(result).toEqual(standardData);
        done();
      });
  });

  it('should handle array data', (done) => {
    const arrayData = [{ id: 1 }, { id: 2 }];
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(arrayData));

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
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