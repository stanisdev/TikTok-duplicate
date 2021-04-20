import { getConnection, Brackets } from 'typeorm';
import { ProfileViwerType } from '../interfaces/general.interface';
import { UserRelationship, UserRelationshipType } from '../../entities';

export class UniversalService {

  /**
   * Determine the relationship between a viewer and
   * the owner of being viewed profile
   */
  static async getViewerType(
    viewerId: string,
    userId: string,
  ): Promise<ProfileViwerType> {
    if (viewerId == userId) {
      return ProfileViwerType.OWNER;
    } else if (await this.doesFriendshipExist(userId, viewerId)) {
      return ProfileViwerType.FRIEND;
    } else {
      return ProfileViwerType.GUEST;
    }
  }

  private static async doesFriendshipExist(
    userId: string,
    viewerId: string,
  ): Promise<boolean> {
    const records = await getConnection()
      .getRepository(UserRelationship)
      .createQueryBuilder('ur')
      .where(
        new Brackets((qb) => {
          qb.where('ur.activeUserId = :u1', { u1: userId })
            .andWhere('ur.exposedUserId = :u2', { u2: viewerId })
            .andWhere('ur.type = :type', {
              type: UserRelationshipType.FOLLOWING,
            });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where('ur.exposedUserId = :u3', { u3: userId })
            .andWhere('ur.activeUserId = :u4', { u4: viewerId })
            .andWhere('ur.type = :type', {
              type: UserRelationshipType.FOLLOWING,
            });
        }),
      )
      .getMany();
    return records?.length == 2;
  }
}
