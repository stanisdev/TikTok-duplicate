import * as faker from 'faker';
import { VideoAvailableFor } from '../../src/entities';

export const videos = {
  naturePublic: {
    id: faker.datatype.number(100000000000000),
    caption: faker.name.findName(),
    availableFor: VideoAvailableFor.PUBLIC,
    allowUser: [0],
    likesCount: 3,
  },
  waterfallForFriends: {
    id: faker.datatype.number(100000000000000),
    caption: faker.name.findName(),
    availableFor: VideoAvailableFor.FRIENDS,
    allowUser: [0],
    likesCount: 1,
  },
  moonPrivate: {
    id: faker.datatype.number(100000000000000),
    caption: faker.name.findName(),
    availableFor: VideoAvailableFor.PRIVATE,
    allowUser: [0],
    likesCount: 5,
  },
};
