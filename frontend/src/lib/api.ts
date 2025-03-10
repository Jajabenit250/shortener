import Axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { CreateUrlDto, UrlFiltersDto, AccessUrlDto } from "../utils/interface";

// Base configuration
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6060";
const sessionKey = "URL_SHORTENER:TOKEN";
const sessionRefreshKey = "URL_SHORTENER:REFRESH_TOKEN";
const sessionUser = "URL_SHORTENER:USER";
const sessionUserRole = "URL_SHORTENER:USER_ROLE";

// Get token from localStorage with SSR safety check
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(sessionKey);
  }
  return null;
};

// Axios instance creation
const axiosInstance = Axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

// Request interceptor to add token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem(sessionRefreshKey);
        if (!refreshToken) {
          // No refresh token, redirect to login
          handleLogout();
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await Axios.post(`${baseUrl}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Store new tokens
        localStorage.setItem(sessionKey, accessToken);
        localStorage.setItem(sessionRefreshKey, newRefreshToken);
        
        // Update authorization header
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    
    // Format error message for user display
    const errorMessage = formatApiErrorResponse(error);
    
    // Show error toast
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return Promise.reject(error);
  }
);

// Helper function to format error responses
export const formatApiErrorResponse = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.code) {
    return `Error: ${error.response.data.code}`;
  }
  return error.message || "An unknown error occurred";
};

// Handle user logout
export const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(sessionRefreshKey);
    localStorage.removeItem(sessionUser);
    localStorage.removeItem(sessionUserRole);
    
    window.location.href = "/auth/login";
  }
};

// Authentication APIs - From AuthController
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  userName: string;
  passwordHash: string;
  role?: string;
  status?: string;
  authProvider?: string;
  authProviderId?: string;
  displayName?: string;
}

export interface GoogleAuthDto {
  idToken: string;
}

export interface GithubAuthDto {
  code: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export const createUser = async (data: CreateUserDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth`, data);
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const login = async (data: LoginRequestDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth/login`, data);
    
    // Store tokens and user info
    localStorage.setItem(sessionKey, response.data.accessToken);
    localStorage.setItem(sessionRefreshKey, response.data.refreshToken);
    localStorage.setItem(sessionUser, JSON.stringify(response.data.user));
    localStorage.setItem(sessionUserRole, response.data.user.role);
    
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const logout = async (): Promise<any> => {
  try {
    // Call logout endpoint
    await axiosInstance.post(`/auth/logout`);
    
    // Clear local storage
    handleLogout();
    
    return { message: "Successfully logged out" };
  } catch (error) {
    // Still clear local storage even if the API call fails
    handleLogout();
    throw formatApiErrorResponse(error);
  }
};

export const googleAuth = async (data: GoogleAuthDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth/google`, data);
    
    // Store tokens and user info
    localStorage.setItem(sessionKey, response.data.accessToken);
    localStorage.setItem(sessionRefreshKey, response.data.refreshToken);
    localStorage.setItem(sessionUser, JSON.stringify(response.data.user));
    localStorage.setItem(sessionUserRole, response.data.user.role);
    
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const githubAuth = async (data: GithubAuthDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth/github`, data);
    
    // Store tokens and user info
    localStorage.setItem(sessionKey, response.data.accessToken);
    localStorage.setItem(sessionRefreshKey, response.data.refreshToken);
    localStorage.setItem(sessionUser, JSON.stringify(response.data.user));
    localStorage.setItem(sessionUserRole, response.data.user.role);
    
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const refreshToken = async (data: RefreshTokenRequestDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/auth/refresh`, data);
    
    // Store new tokens
    localStorage.setItem(sessionKey, response.data.accessToken);
    localStorage.setItem(sessionRefreshKey, response.data.refreshToken);
    
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};



export const shortenUrl = async (data: CreateUrlDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/shorten`, data);
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const getUserUrls = async (
  filters: UrlFiltersDto = {}, 
  page: number = 1, 
  limit: number = 20
): Promise<any> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.status) queryParams.append("status", filters.status);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    
    const response = await axiosInstance.get(`/urls?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const getUrlAnalytics = async (
  alias: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<any> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append("startDate", startDate.toISOString());
    if (endDate) queryParams.append("endDate", endDate.toISOString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await axiosInstance.get(`/analytics/${alias}${queryString}`);
    
    return response.data;
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

/**
 * Check if a URL is password-protected or get redirection info
 * This is used by the redirect page for the initial check
 */
export const checkRedirect = async (alias: string): Promise<any> => {
  try {
    const response = await await axiosInstance.get(`${alias}`);

    const data = response?.data;

    return data
  } catch (error) {
    throw formatApiErrorResponse(error);
  }
};

export const submitPasswordDirectProtectedUrl = async (
  alias: string,
  password: string
): Promise<any> => {
  const response = await axiosInstance.post(`${alias}/access`, JSON.stringify({ password }));
  
  const data = response.data;
  
  return data;
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(sessionKey);
};

// Helper function to get current user data
export const getCurrentUser = (): any => {
  if (typeof window === "undefined") return null;
  
  const userString = localStorage.getItem(sessionUser);
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    return null;
  }
};

// Helper function to get user role
export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(sessionUserRole);
};

export default axiosInstance;
