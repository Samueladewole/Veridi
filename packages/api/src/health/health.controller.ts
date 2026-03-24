import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { prisma } from "@veridi/database";
import { Public } from "../common/decorators";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: "Health check" })
  async check() {
    let dbStatus = "disconnected";

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch {
      dbStatus = "disconnected";
    }

    return {
      status: dbStatus === "connected" ? "ok" : "degraded",
      db: dbStatus,
      redis: "not_configured",
      version: process.env["npm_package_version"] || "0.0.0",
      timestamp: new Date().toISOString(),
    };
  }
}
