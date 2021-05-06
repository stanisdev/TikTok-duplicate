export interface VideoFullInfo {
  id: number;
  caption: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    username: string;
  }
}

export interface VideoCommentsCount {
  total: number;
  videoId: number;
}
