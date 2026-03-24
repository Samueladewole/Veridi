import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthenticatedRequest } from "../common/types";
import { FaceService } from "./face.service";
import { FaceLivenessDto, FaceMatchDto } from "./dto";

@ApiTags("Face")
@ApiBearerAuth()
@Controller("v1/face")
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post("liveness")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Face liveness detection" })
  async liveness(@Body() dto: FaceLivenessDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    return this.faceService.checkLiveness(dto.image, dto.consent_token, clientId);
  }

  @Post("match")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Face match comparison" })
  async match(@Body() dto: FaceMatchDto, @Req() req: AuthenticatedRequest) {
    const { id: clientId } = req.client;
    const referenceImage = dto.reference_image || "";
    return this.faceService.matchFaces(dto.selfie, referenceImage, dto.consent_token, clientId);
  }
}
