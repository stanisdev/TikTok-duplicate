import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/modules/app/app.module';
import { getConnection } from 'typeorm';
import { User, UserRelationshipType } from '../../src/entities';
import { users as userFixtures } from '../fixtures/users';
import { videos as videoFixtures } from '../fixtures/videos';
import * as lodash from 'lodash';
import { Loader } from '../helpers/loader';

describe('User', () => {
  let app;
  let server;
  let db;
  let userRepository;
  let loader: Loader;

  beforeEach(async () => {
    const mf = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mf.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    db = getConnection();
    userRepository = db.getRepository(User);
    loader = new Loader(db);
    await loadFixtures();
  });

  const loadFixtures = lodash.once(async () => {
    const viewer = await loader.createUser(userFixtures.viewer);
    const follower = await loader.createUser(userFixtures.follower);
    const following = await loader.createUser(userFixtures.following);

    await Promise.all([
      loader.createVideo(viewer, videoFixtures.naturePublic),
      loader.createVideo(viewer, videoFixtures.waterfallForFriends),
      loader.createVideo(viewer, videoFixtures.moonPrivate),
      loader.createRelationship(follower, viewer, UserRelationshipType.FOLLOWING),
      loader.createRelationship(viewer, following, UserRelationshipType.FOLLOWING),
      loader.createRelationship(following, viewer, UserRelationshipType.FOLLOWING),
    ]);
  });

  describe('GET /user/:username', () => {
    it('should get info about the user if ' +
      'the viewer is the owner of the profile', async () => {
      const { body: { accessToken } } = await request(server).post('/auth/sign_in').send({
        username: userFixtures.viewer.username,
        password: userFixtures.viewer.decryptedPassword,
      });
      const { status, body } = await request(server)
        .get(`/user/${userFixtures.viewer.username}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.following).toBe(1);
      expect(body.followers).toBe(2);
      expect(body.likes).toBe(9);
    });

    it('should get info about the user if ' +
      'the viewer is a follower of the profile\'s owner', async () => {
      const { body: { accessToken } } = await request(server).post('/auth/sign_in').send({
        username: userFixtures.follower.username,
        password: userFixtures.follower.decryptedPassword,
      });
      const { status, body } = await request(server)
        .get(`/user/${userFixtures.viewer.username}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.following).toBe(1);
      expect(body.followers).toBe(2);
      expect(body.likes).toBe(3);
    });
    
    it('should get info about the user if ' +
      'the viewer is a friend of the profile\'s owner', async () => {
      const { body: { accessToken } } = await request(server).post('/auth/sign_in').send({
        username: userFixtures.following.username,
        password: userFixtures.following.decryptedPassword,
      });
      const { status, body } = await request(server)
        .get(`/user/${userFixtures.viewer.username}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.following).toBe(1);
      expect(body.followers).toBe(2);
      expect(body.likes).toBe(4);
    });
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });
});
