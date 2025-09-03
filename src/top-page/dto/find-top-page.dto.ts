import { IsEnum } from 'class-validator';
import { TopLevelCategory } from '../top-page.model';
import { Type } from 'class-transformer';

export class FindTopPageDto {
  @IsEnum(TopLevelCategory, {
	message: 'Category must be one of: Curses, Services, Books, Products',
  })
  @Type(() => String)
  firstCategory: TopLevelCategory;
}
