import { UserRole } from "../models";

export interface User {
  id: number;
  username?: string;
  full_name: string;
  email?: string;
  disabled: boolean;
  user_role_id?: number;
  user_role?: UserRole;
  password?: string;
}
