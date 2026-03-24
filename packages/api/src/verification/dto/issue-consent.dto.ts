import { IsString, MinLength } from "class-validator";

export class IssueConsentDto {
  @IsString()
  @MinLength(3)
  purpose!: string;

  @IsString()
  subject_id!: string;
}
