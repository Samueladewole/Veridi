import { IsString } from "class-validator";

export class FaceLivenessDto {
  @IsString()
  image!: string; // base64

  @IsString()
  consent_token!: string;
}
