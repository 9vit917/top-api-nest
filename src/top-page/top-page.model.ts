import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TopLevelCategory {
	Curses,
	Services,
	Books,
	Products,
}

class Hh {
	@Prop()
	count: number;

	@Prop()
	juniorSalary: number;

	@Prop()
	middleSalary: number;

	@Prop()
	seniorSalary: number;
}

class TopPageAdvantage {
	@Prop()
	title: string;

	@Prop()
	description: string;
}

@Schema({ timestamps: true })
export class TopPageModel {
	@Prop({ enum: TopLevelCategory })
	firstCategory: TopLevelCategory;

	@Prop()
	secondCategory: string;

	@Prop({ unique: true })
	alias: string;

	@Prop()
	title: string;

	@Prop()
	category: string;

	@Prop({ type: Hh })
	hh?: Hh;

	@Prop([TopPageAdvantage])
	advantage: TopPageAdvantage[];

	@Prop()
	seoText: string;

	@Prop()
	tagsTitle: string;

	@Prop([String])
	tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel)
