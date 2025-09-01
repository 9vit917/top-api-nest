import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

class Hh {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

class TopPageAdvantage {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDTO {
  @IsEnum(TopLevelCategory, {
    message: 'Category must be one of: Curses, Services, Books, Products',
  })
  @Type(() => String)
  firstCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Hh)
  hh?: Hh;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantage)
  advantage: TopPageAdvantage[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
