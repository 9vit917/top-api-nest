import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserDocument, UserModel } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, genSaltSync, hash } from 'bcryptjs';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService
	) { }

	async createUser(authDto: AuthDto) {
		const salt = genSaltSync(10);
		const newUser = new this.userModel({
			email: authDto.login,
			passwordHash: await hash(authDto.password, salt)
		});
		return newUser.save();
	}

	async findUserByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD);
		}

		return { email: user.email };
	}

	async login(email: string) {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	}
}
