import { VideoAvailableFor } from "src/entities";

export interface UserFixture {
  phone: string,
  username: string,
  encryptedPassword: string,
  decryptedPassword: string,
  salt: string,
  status: number,
};

export interface VideoFixture {
  id: number,
  caption: string,
  availableFor: VideoAvailableFor,
  allowUser: number[],
  likesCount: number,
};
