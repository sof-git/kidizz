import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ChildDto {
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsNumber()
  @IsNotEmpty()
  childCareId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  childCareIds: number[];
}
