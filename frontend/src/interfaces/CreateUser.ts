export interface CreateUser {
  username: string;
  full_name: string;
  email: string;
  disabled: boolean;
  user_role: { id: number };
  password: string;
}
