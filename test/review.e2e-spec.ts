import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
	name: "Test",
	title: "Title",
	description: "Test Description",
	rating: 5,
	productId,
}

const testWrongDto: CreateReviewDto = {
	name: "Test",
	title: "Title",
	description: "Test Description",
	rating: 6,
	productId,
}

const loginDto: AuthDto = {
	login: "qwe@qwe.com",
	password: "123",
}

describe('ReviewController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init()

		const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);
		token = body.access_token;
	})

	it('/review/create (POST) success', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	})

	it('/review/create (POST) fail', async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testWrongDto)
			.expect(400)
	})

	it('/review/byProduct/:productId (GET) success', async () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			})
	})

	it('/review/byProduct/:productId (GET) fail', () => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			})
	})

	it('/review/:id (DELETE) success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set(
				'Authorization', 'Bearer ' + token
			)
			.expect(200)
	})

	it('/review/:id (DELETE) fail', () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set(
				'Authorization', 'Bearer ' + token
			)
			.expect(404)
	})

	afterAll(() => {
		disconnect();
	})
})