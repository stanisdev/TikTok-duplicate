import * as faker from 'faker';

const encryptedPassword =
  '$2b$10$v3Iiw3EtuE.fJOUDZ3j8deTI1AIdROrVv0OE9F.PtNWhvGisF29i2';
const decryptedPassword = 'wg0434ko2';
const salt = 'lA304';

export const users = {
  viewer: {
    phone: faker.datatype.number(100000000000),
    username: faker.internet.userName(),
    encryptedPassword,
    decryptedPassword,
    salt,
    status: 2,
  },
  follower: {
    phone: faker.datatype.number(100000000000),
    username: faker.internet.userName(),
    encryptedPassword,
    decryptedPassword,
    salt,
    status: 2,
  },
  following: {
    phone: faker.datatype.number(100000000000),
    username: faker.internet.userName(),
    encryptedPassword,
    decryptedPassword,
    salt,
    status: 2,
  },
};
