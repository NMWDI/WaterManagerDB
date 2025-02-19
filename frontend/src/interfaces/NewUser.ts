export interface NewUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  disabled: boolean;
  user_role_id: number;
  password: string;
}
