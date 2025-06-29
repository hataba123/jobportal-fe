import { User } from "@/types/User";
// 📁 src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}
