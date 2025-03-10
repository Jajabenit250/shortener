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
