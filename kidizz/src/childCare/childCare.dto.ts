import { IsString, IsNotEmpty } from 'class-validator';

export class ChildCareDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
