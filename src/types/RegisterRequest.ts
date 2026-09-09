import { RoleEnum } from "./user";

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  role: RoleEnum;
};
