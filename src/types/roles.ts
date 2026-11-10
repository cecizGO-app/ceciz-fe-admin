export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Operations Staff" | "Finance Staff";
  status: "Active" | "Disabled";
  lastActive: string;
  avatarInitials: string;
}

export interface ModulePermissionRow {
  moduleId: string;
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  isOwnerOnly?: boolean;
}

export interface RolePermissionMatrix {
  roleName: string;
  permissions: ModulePermissionRow[];
}
