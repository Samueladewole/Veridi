import { IsString, IsOptional } from "class-validator";

export class FaceMatchDto {
  @IsString()
  selfie!: string; // base64

  @IsString()
  @IsOptional()
  reference_nin?: string;

  @IsString()
  @IsOptional()
  reference_image?: string; // base64

  @IsString()
  consent_token!: string;
}
