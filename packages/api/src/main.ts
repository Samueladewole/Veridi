import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import compression from "compression";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters";
import { ResponseInterceptor, LoggingInterceptor } from "./common/interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn"],
  });

  // Security & compression
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "https://veridi.io",
      "https://dashboard.veridi.africa",
      "https://admin.veridi.africa",
    ],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filter & interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // Swagger (dev only)
  if (process.env["NODE_ENV"] !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Veridi API")
      .setDescription("Identity Verification Infrastructure for Africa")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  const port = process.env["PORT"] ?? 3000;
  await app.listen(port);
  Logger.log(`Veridi API running on port ${port}`, "Bootstrap");
  Logger.log(`Swagger: http://localhost:${port}/api/docs`, "Bootstrap");
}

bootstrap();
