export interface CodeLifetime {
  amount: number;
  unit: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AvailableUserFields {
  id: string;
  phone: number;
  username: string;
  status: number;
  createdAt: Date;
}

export interface ConfirmPhoneResponse {
  userId: string;
}
