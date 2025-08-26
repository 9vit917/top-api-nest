import { ConfigService } from '@nestjs/config';

export const getMongoConfig = async (configSetvice: ConfigService) => {
	return {
		uri: getMongoString(configSetvice),
	}
}

const getMongoString = (configService: ConfigService) => 'mongodb://' +
	configService.get<string>('MONGO_LOGIN') +
	':' +
	configService.get<string>('MONGO_PASSWORD') +
	'@' +
	configService.get<string>('MONGO_HOST') +
	':' +
	configService.get<string>('MONGO_PORT') +
	'/' +
	configService.get<string>('MONGO_DATABASE');
