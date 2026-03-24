import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Request } from "express";

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
  requestId: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.headers["x-request-id"] as string;

    return next.handle().pipe(
      map((data) => {
        // If the response already has the wrapper shape, pass through
        if (data && typeof data === "object" && "success" in data) {
          return data;
        }

        // Separate meta from data if present
        let responseData = data;
        let meta: Record<string, unknown> | undefined;

        if (data && typeof data === "object" && "_meta" in data) {
          const { _meta, ...rest } = data as Record<string, unknown>;
          meta = _meta as Record<string, unknown>;
          responseData = rest as T;
        }

        return {
          success: true as const,
          data: responseData,
          ...(meta && { meta }),
          requestId,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
