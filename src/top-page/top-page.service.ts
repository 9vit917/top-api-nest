import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModel, TopPageModuleDocument } from './top-page.model';
import { Model, Types } from 'mongoose';
import { CreateTopPageDTO } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { addDays } from 'date-fns';

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

  async updateTopPage(id: string | Types.ObjectId, dto: CreateTopPageDTO) {
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

  async findForHhUpdate(date: Date) {
    return this.topPageModel
      .find({
        firstCategory: 'Curses',
        $or: [
          { 'hh.updatedAt': { $lt: addDays(date, -1) } },
          { 'hh.updatedAt': { $exist: false } },
        ],
      })
      .exec();
  }
}
