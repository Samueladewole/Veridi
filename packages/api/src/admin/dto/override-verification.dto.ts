import { IsString, IsInt, Min, Max } from "class-validator";

export class OverrideVerificationDto {
  @IsString()
  status!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  confidence!: number;

  @IsString()
  reason!: string;
}
