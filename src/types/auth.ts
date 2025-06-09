import { User } from "./user";
// 📁 src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthResponse {
  user: User;
  accessToken: string;
}
