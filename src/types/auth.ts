// User type from API response
export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthError {
  success: false;
  message: string;
  error?: string;
} 