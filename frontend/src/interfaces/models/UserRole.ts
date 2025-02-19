import { SecurityScope } from "../models";

export interface UserRole {
  id: number;
  name: string;
  security_scopes: SecurityScope[];
}
