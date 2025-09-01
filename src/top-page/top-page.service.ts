import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModel, TopPageModuleDocument } from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDTO } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageModuleDocument>,
  ) {}

  async create(dto: CreateTopPageDTO) {
    return this.topPageModel.create(dto);
  }

  async getById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateTopPage(id: string, dto: CreateTopPageDTO) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async find(dto: FindTopPageDto) {
    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstCategory: dto.firstCategory,
          },
        },
        {
          $lookup: {
            from: 'productmodels',
            localField: 'firstCategory',
            foreignField: 'categories',
            as: 'products',
          },
        },
        {
          $addFields: {
            products: {
              $function: {
                body: `function (reviews) {
                  reviews.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                  );
                  return reviews;
                }`,
                args: ['$products'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec();
  }
}
