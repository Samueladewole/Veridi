import { IsString, IsArray, ArrayMinSize, IsOptional } from "class-validator";

export class RequestBackgroundCheckDto {
  @IsString()
  subject_nin!: string;

  @IsString()
  consent_token!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  check_types!: string[]; // ["employment", "criminal", "credential"]

  @IsString()
  @IsOptional()
  webhook_url?: string;
}
