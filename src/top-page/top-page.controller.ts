import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDTO } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from 'src/pipies/ad-validation.pipe';
import { NOT_FOUND_TOP_PAGE } from './top-page.constants';
import { HhService } from 'src/hh/hh.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly hhService: HhService,
    private readonly topPageService: TopPageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDTO) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.getById(id);

    if (!topPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE);
    }
    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDTO,
  ) {
    return this.topPageService.updateTopPage(id, dto);
  }

  @HttpCode(200)
  @Post('/find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.find(dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/test')
  async test(@Body() dto: FindTopPageDto) {
    const data = await this.topPageService.findForHhUpdate(new Date());
    for (const page of data) {
      const hhData = await this.hhService.getData(page.category);
      page.hh = hhData;
      await this.topPageService.updateTopPage(page._id, page);
    }
  }
}
