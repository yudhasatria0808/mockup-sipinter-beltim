// Role Types

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isProtected: boolean;
}

export interface RoleDetail extends Role {
  rolePermission: RolePermission[];
}

export interface RolePermission {
  modulId: string;
  modulName: string;
  modulDescription: string;
  idx: number;
  menus: RoleMenuPermission[];
}

export interface RoleMenuPermission {
  menuId: string;
  menuName: string;
  menuDescription: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  hasAccess: boolean;
  idx: number;
  child: RoleMenuPermission[];
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  rolePermission: RolePermissionRequest[];
}

export interface RoleUpdateRequest extends RoleCreateRequest {}

export interface RolePermissionRequest {
  modulId: string;
  menus: RoleMenuPermissionRequest[];
}

export interface RoleMenuPermissionRequest {
  menuId: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
