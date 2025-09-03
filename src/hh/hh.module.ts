import { Module } from '@nestjs/common';
import { HhService } from './hh.service';
import { ConfigModule } from '@nestjs/config';
import { TopPageModule } from 'src/top-page/top-page.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [HhService],
  imports: [TopPageModule, ConfigModule, HttpModule],
  exports: [HhService],
})
export class HhModule {}
