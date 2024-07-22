import { Roles } from "../Constants/Roles";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Roles;
  permissions: string[];
}

export interface getUserQuery {
  q?: string;
  page?: number;
  size?: number;
}
