export interface Pagination {
  limit: number;
  page: number;
}

export enum ProfileViwerType {
  GUEST = 0,
  FRIEND = 1,
  OWNER = 2,
}

export interface LimitConfig {
  default: number,
  max: number,
}
