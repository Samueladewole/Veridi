import { IsString, Length } from "class-validator";

export class VerifyNinDto {
  @IsString()
  @Length(11, 11, { message: "NIN must be exactly 11 digits" })
  nin!: string;

  @IsString()
  consent_token!: string;
}
