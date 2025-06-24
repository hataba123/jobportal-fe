import { RoleEnum } from "./User";

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  role: RoleEnum;
};
