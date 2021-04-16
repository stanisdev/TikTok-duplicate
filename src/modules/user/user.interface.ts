export interface UserInfoResponse {
  following: number;
  followers: number;
  likes: number;
}

export enum ProfileViwerType {
  GUEST = 0,
  FRIEND = 1,
  OWNER = 2,
}

export interface UserVideosResponse {
  id: number;
  viewsCount: number;
}
