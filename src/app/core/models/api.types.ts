// src/app/core/models/api-types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  uuid: string;
  uuidExpire: string; // ISO string
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role: string; // ex: "USER"
}

export interface User {
  id?: number;
  uuid: string;
  uuidExpire?: string | null;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  active?: boolean;
}

export interface TriageFormsDTO {
  id?: number;
  sintomas: string;
}
