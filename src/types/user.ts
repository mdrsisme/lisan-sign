export type AppRole = 'user' | 'admin';
export type TokenType = 'refresh' | 'verification' | 'password_reset';

export interface User {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  is_verified: boolean;
  is_premium: boolean;
  role: AppRole;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export interface Token {
  id: string;
  user_id: string;
  token: string;
  type: TokenType;
  is_used: boolean;
  expires_at: string;
  created_at: string;
}

export interface UserStats {
  total_users: number;
  by_role: {
    admin: number;
    user: number;
  };
  by_status: {
    verified_users: number;
    premium_users: number;
    unverified: number;
  };
}