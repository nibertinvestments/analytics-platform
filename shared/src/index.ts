// Shared types and utilities for Analytics Platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ApiResponse<T = any> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
};

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  DASHBOARDS: '/api/dashboards',
  ANALYTICS: '/api/analytics',
} as const;