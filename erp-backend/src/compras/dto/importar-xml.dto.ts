import { IsNotEmpty, IsString } from 'class-validator';

export class ImportarXmlDto {
  @IsString()
  @IsNotEmpty()
  xml: string;
}
