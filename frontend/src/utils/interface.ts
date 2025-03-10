// URL APIs - From UrlsController
export interface CreateUrlDto {
  originalUrl: string;
  alias?: string;
  expiresAt?: Date;
  isPasswordProtected?: boolean;
  password?: string;
}

export interface UrlFiltersDto {
  search?: string;
  status?: string;
}

export interface AccessUrlDto {
  password: string;
}

export interface CreateUrlDto {
  originalUrl: string;
  alias?: string;
  expiresAt?: Date;
  isPasswordProtected?: boolean;
  password?: string;
}

export interface UpdateUrlDto {
  originalUrl?: string;
  expiresAt?: Date;
  isPasswordProtected?: boolean;
  password?: string;
  status?: string;
}

export interface AccessUrlDto {
  password: string;
}

export interface UrlFiltersDto {
  search?: string;
  status?: string;
}

export interface RedirectResponse {
  originalUrl?: string;
  isPasswordProtected?: boolean;
  status?: string;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PasswordAccessResponse {
  originalUrl?: string;
  success?: boolean;
  error?: string;
}

export interface UrlResponseDto {
  id: string;
  originalUrl: string;
  alias: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
  userId: string;
  status: string;
  isPasswordProtected: boolean;
}

export interface UrlSearchResponseDto {
  urls: UrlResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export interface UrlAnalyticsDto {
  totalClicks: number;
  uniqueVisitors: number;
  referrers: Record<string, number>;
  browsers: Record<string, number>;
  devices: Record<string, number>;
  timeline: { date: string; clicks: number }[];
}

