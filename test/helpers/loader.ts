import {
  User,
  Video,
  VideoLike,
  UserRelationship,
  UserRelationshipType,
} from '../../src/entities';
import { Connection } from 'typeorm';
import { UserFixture, VideoFixture } from './interfaces';

export class Loader {
  constructor(private db: Connection) {}

  createUser(fixture: UserFixture): Promise<User> {
    const user = new User();
    user.phone = fixture.phone;
    user.username = fixture.username;
    user.password = fixture.encryptedPassword;
    user.salt = fixture.salt;
    user.status = fixture.status;

    return this.db.getRepository(User).save(user);
  }

  createVideo(user: User, fixture: VideoFixture): Promise<Video> {
    const video = new Video();
    video.id = fixture.id;
    video.user = user;
    video.caption = fixture.caption;
    video.availableFor = fixture.availableFor;
    video.allowUser = fixture.allowUser;
    video.likesCount = fixture.likesCount;

    return this.db.getRepository(Video).save(video);
  }

  async createRelationship(
    activeUser: User,
    exposedUser: User,
    type: UserRelationshipType,
  ): Promise<void> {
    const relationship = new UserRelationship();
    relationship.activeUserId = activeUser.id;
    relationship.exposedUserId = exposedUser.id;
    relationship.type = type;

    await this.db.getRepository(UserRelationship).save(relationship);
  }

  async createVideoLike(user: User, video: Video): Promise<void> {
    const like = new VideoLike();
    like.user = user;
    like.video = video;

    await this.db.getRepository(VideoLike).save(like);
  }
}
