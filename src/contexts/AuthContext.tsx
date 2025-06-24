'use client';

import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { SignInUser, SignUpUser } from "@/lib/validations/user";
import { User, AuthResponse, RegisterResponse } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthResponse, Error, SignInUser>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<RegisterResponse, Error, SignUpUser>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth-token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }

  return response;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to get current user
  const {
    data: userResponse,
    error,
    isLoading,
  } = useQuery<{ success: boolean; data: User } | null, Error>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        return null;
      }

      try {
        const response = await makeAuthenticatedRequest('/api/auth/me');
        return await response.json();
      } catch (error) {
        // If 401, clear the invalid token
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('auth-token');
        }
        return null;
      }
    },
    retry: false,
  });

  const user = userResponse?.data ?? null;
  const isAuthenticated = !!user;

  const loginMutation = useMutation({
    mutationFn: async (credentials: SignInUser) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    },
    onSuccess: (response: AuthResponse) => {
      if (response.data?.token) {
        localStorage.setItem('auth-token', response.data.token);
        // Update the user query cache
        queryClient.setQueryData(["/api/auth/me"], {
          success: true,
          data: response.data.user,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: SignUpUser) => {
      // Extract only the fields needed for the API (excluding confirmPassword)
      const { confirmPassword: _, ...apiData } = userData;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    },
    onSuccess: (_response: RegisterResponse) => {
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('auth-token');
      queryClient.clear();
      queryClient.setQueryData(["/api/auth/me"], null);
    },
    onSuccess: () => {
      // User will be redirected, no toast needed
    },
    onError: (_error: Error) => {
      // Even if the server request fails, clear local storage
      localStorage.removeItem('auth-token');
      queryClient.clear();
      queryClient.setQueryData(["/api/auth/me"], null);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 