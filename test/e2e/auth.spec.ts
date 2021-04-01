import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app/app.module';
import { getConnection } from 'typeorm';

describe('Auth', () => {
  let app;
  let server;

  beforeEach(async () => {
    const mf = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = mf.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('GET /', () => {
    it('should respond with status 200', async () => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
    });
  });

  afterAll(async () => {
    await app.close();
    await getConnection().close();
  });
});
