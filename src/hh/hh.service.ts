import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_URL } from './hh.constants';
import { HttpService } from '@nestjs/axios';
import { HhResponse } from './hh.model';
import { firstValueFrom } from 'rxjs';
import { HhData } from 'src/top-page/top-page.model';

@Injectable()
export class HhService {
  private token: string;

  constructor(
	private readonly configService: ConfigService,
	private readonly httpService: HttpService,
  ) {
	this.token = this.configService.get('HH_TOKEN') ?? '';
  }

  async getData(text: string): Promise<HhData | undefined> {
	try {
		const { data } = await firstValueFrom(
		this.httpService.get<HhResponse>(API_URL.vacancies, {
			params: {
			text,
			cluster: true,
			},
			headers: {
			'User-Agent': 'OwlTop/1.0 (viktar_kazachenka@epam.com)',
			Authorization: 'Bearer ' + this.token,
			},
		}),
		);
		return this.parseDate(data);
	} catch (error) {
		Logger.error(error);
	}
  }

  private parseDate(data: HhResponse): HhData {
	const salaryCluster = data.clusters.find((c) => c.id == 'salary');
	if (!salaryCluster) {
		throw new Error('This cluster doesnt exist');
	}
	return {
		count: data.found,
		juniorSalary: this.getSellaryFromString(salaryCluster.items[0].name),
		middleSalary: this.getSellaryFromString(
		salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name,
		),
		seniorSalary: this.getSellaryFromString(
		salaryCluster.items[salaryCluster.items.length - 1].name,
		),
		updatedAt: new Date(),
	};
  }

  private getSellaryFromString(sallary: string): number {
	const numberRegExp = /(\d+)/g;
	const res = sallary.match(numberRegExp);

	return res ? Number(res[0]) : 0;
  }
}
