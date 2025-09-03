import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserModel {
	@Prop({ unique: true })
	email: string;

	@Prop({ required: true })
	passwordHash: string;
}


export const UserSchema = SchemaFactory.createForClass(UserModel);

export type UserDocument = UserModel & Document;