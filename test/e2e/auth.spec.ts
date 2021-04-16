import * as request from 'supertest';
import * as faker from 'faker';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app/app.module';
import { getConnection } from 'typeorm';
import { User, Code } from '../../src/entities';

describe('Auth', () => {
  let app;
  let server;
  let db;
  let userRepository;
  let codeRepository;

  beforeEach(async () => {
    const mf = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mf.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    db = getConnection();
    userRepository = db.getRepository(User);
    codeRepository = db.getRepository(Code);
  });

  describe('GET /', () => {
    it('should respond with status 200', async () => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /auth/register_phone', () => {
    it('should register a new phone number', async () => {
      const phone = faker.datatype.number(100000000000);
      const response = await request(server).post('/auth/register_phone').send({
        phone,
      });
      expect(response.status).toBe(201);

      const record = await codeRepository
        .createQueryBuilder('code')
        .innerJoinAndSelect('code.user', 'user')
        .where('user.phone = :phone', { phone })
        .getRawOne();

      expect(record.user_phone).toBe(phone.toString());
      expect(record.user_status).toBe(0);
      expect(typeof +record.code_code).toBe('number');
      expect(new Date(record.code_expireAt).getTime()).toBeGreaterThan(
        Date.now(),
      );
    });

    it(
      'should send new sms code if a phone number' +
        ' was registered but not confirmed',
      async () => {
        const phone = faker.datatype.number(100000000000);

        await request(server).post('/auth/register_phone').send({
          phone,
        });
        const record = await codeRepository
          .createQueryBuilder('code')
          .innerJoinAndSelect('code.user', 'user')
          .where('user.phone = :phone', { phone })
          .getRawOne();

        const oldCode = record.code_code;
        const response = await request(server)
          .post('/auth/register_phone')
          .send({
            phone,
          });
        expect(response.status).toBe(201);

        const records = await codeRepository
          .createQueryBuilder('code')
          .where('code.userId = :userId', { userId: record.user_id })
          .getRawMany();

        expect(records.length).toBe(1);
        expect(records[0].code_code).not.toBe(oldCode);
      },
    );

    it('should respond an error since the given phone is already registered', async () => {
      const username = faker.internet.userName();
      const phone = faker.datatype.number(100000000000);

      const user = new User();
      user.phone = phone;
      user.username = username;
      user.password = '';
      user.salt = '';
      user.status = 1;

      await userRepository.save(user);
      const response = await request(server).post('/auth/register_phone').send({
        phone,
      });
      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });
});
