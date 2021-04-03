export interface CodeLifetime {
  amount: number;
  unit: string;
}

export class AuthTokens {
  accessToken: string;
  refreshToken: string;
}
