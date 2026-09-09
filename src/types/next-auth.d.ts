import { User } from "@/types/user"; // Đường dẫn tới kiểu User của bạn

declare module "next-auth" {
  interface Session {
    backendUser?: User;
    jwt?: string;
  }
}
