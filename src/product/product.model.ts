import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

class ProductCharacteristic {
	@Prop()
	name: string;

	@Prop()
	value: string
}

@Schema({ timestamps: true })
export class ProductModel {
	@Prop()
	imgae: string;

	@Prop()
	title: string;

	@Prop()
	price: number;

	@Prop()
	oldPrrice: number;

	@Prop()
	credit: number;

	@Prop()
	description: string;

	@Prop()
	calculatedRating: number;

	@Prop()
	advantages: string;

	@Prop()
	disAdvantages: string;

	@Prop([String])
	categories: string[];

	@Prop([String])
	tags: string[];

	@Prop([ProductCharacteristic])
	characteristics: ProductCharacteristic[];
}


export const ProductSchema = SchemaFactory.createForClass(ProductModel);