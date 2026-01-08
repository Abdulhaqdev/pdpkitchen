// User/Self Types based on OpenAPI spec

export interface Self {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}
