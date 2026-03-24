import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("ResponseTime");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        if (ms > 1000) {
          this.logger.warn(`SLOW ${method} ${originalUrl} ${ms}ms`);
        }
      }),
    );
  }
}
