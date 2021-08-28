export interface User {
  uid: number;
  email: string | null;
  phone: string | null;
  sid: number | null;
  netid: string | null;
  name: string;
  role: number;
  password: string;
}

export interface ImportUser {
  [index: string]: number | null | string;
  sid: number | null;
  email: string | null;
  name: string;
  role: number;
  password: string;
}
