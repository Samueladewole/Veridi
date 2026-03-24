import { IsString, MinLength } from "class-validator";

export class VerifyDriversLicenceDto {
  @IsString()
  @MinLength(6)
  licence_number!: string;

  @IsString()
  consent_token!: string;
}

export class VerifyPassportDto {
  @IsString()
  @MinLength(6)
  passport_number!: string;

  @IsString()
  consent_token!: string;
}
