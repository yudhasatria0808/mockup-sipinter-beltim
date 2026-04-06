// User Types

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roleId: string;
  roleName: string;
  createdDate: string;
}

export interface UserDetail extends User {
  mustChangePassword: boolean;
  updatedDate: string | null;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  roleId: string;
  isActive: boolean;
}

export interface UserUpdateRequest {
  fullName: string;
  email: string;
  roleId: string;
  isActive: boolean;
}

export interface UserResetPasswordRequest {
  newPassword: string;
}
