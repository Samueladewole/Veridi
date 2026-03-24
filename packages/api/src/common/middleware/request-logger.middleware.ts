import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl } = req;
    const requestId = req.headers["x-request-id"] as string;

    res.on("finish", () => {
      const ms = Date.now() - start;
      const { statusCode } = res;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${ms}ms [${requestId}]`,
      );
    });

    next();
  }
}
