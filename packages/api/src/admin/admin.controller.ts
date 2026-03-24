import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AdminRequest } from "../common/types";
import { AdminJwtGuard } from "../common/guards";
import { AdminService } from "./admin.service";
import {
  ClientsQueryDto,
  VerificationsQueryDto,
  AuditLogQueryDto,
} from "./dto/admin-query.dto";
import { OverrideVerificationDto } from "./dto/override-verification.dto";

@ApiTags("Admin")
@ApiBearerAuth()
@UseGuards(AdminJwtGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard/stats")
  @ApiOperation({ summary: "Dashboard statistics" })
  async stats() {
    return this.adminService.getDashboardStats();
  }

  @Get("clients")
  @ApiOperation({ summary: "List clients" })
  async clients(@Query() query: ClientsQueryDto) {
    return this.adminService.getClients(
      { status: query.status, tier: query.tier },
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  @Get("clients/:id")
  @ApiOperation({ summary: "Get client detail" })
  async client(@Param("id") id: string) {
    return this.adminService.getClient(id);
  }

  @Put("clients/:id/approve")
  @ApiOperation({ summary: "Approve client" })
  async approve(@Param("id") id: string, @Req() req: AdminRequest) {
    const admin = req.admin;
    return this.adminService.approveClient(id, admin.id, admin.email);
  }

  @Put("clients/:id/suspend")
  @ApiOperation({ summary: "Suspend client" })
  async suspend(@Param("id") id: string, @Req() req: AdminRequest) {
    const admin = req.admin;
    return this.adminService.suspendClient(id, admin.id, admin.email);
  }

  @Get("verifications")
  @ApiOperation({ summary: "List all verifications" })
  async verifications(@Query() query: VerificationsQueryDto) {
    return this.adminService.getVerifications(
      { status: query.status, type: query.type, clientId: query.clientId },
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  @Put("verifications/:id/override")
  @ApiOperation({ summary: "Override verification result" })
  async override(
    @Param("id") id: string,
    @Body() dto: OverrideVerificationDto,
    @Req() req: AdminRequest,
  ) {
    const admin = req.admin;
    return this.adminService.overrideVerification(
      id, dto.status, dto.confidence, dto.reason, admin.id, admin.email,
    );
  }

  @Get("audit-log")
  @ApiOperation({ summary: "Audit log" })
  async auditLog(@Query() query: AuditLogQueryDto) {
    return this.adminService.getAuditLog(
      { action: query.action, adminId: query.adminId },
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  @Get("flagged")
  @ApiOperation({ summary: "Flagged verifications" })
  async flagged() {
    return this.adminService.getFlaggedVerifications();
  }
}
