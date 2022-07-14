import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module.e2e-spec';

describe.skip('WebhookModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe.skip('POST /webhook', () => {
    test('POST /webhook (유효한 데이터 송부) -> 204 No Content', async () => {
      // given
      const data = {
        timestamp: new Date(),
        intraId: 'joopark',
        inout: 'IN',
      };

      // when
      const response = await request(app.getHttpServer())
        .post(`/product`)
        .send(data);

      // then
      expect(response.status).toBe(204);
    });

    test('POST /webhook (일부 필드 누락된 데이터 송부) -> 400 Bad Request', async () => {
      // given
      // given
      const data = {
        timestamp: new Date(),
        inout: 'IN',
      };

      // when
      const response = await request(app.getHttpServer())
        .post(`/product`)
        .send(data);

      // then
      expect(response.status).toBe(400);
    });
  });
});
