import {
  MOCK_STAFF_USERS,
  MOCK_OPERATIONS_PERMISSIONS,
  MOCK_FINANCE_PERMISSIONS,
} from "@/mocks/mockRolesData";
import type { StaffUser, ModulePermissionRow } from "@/types/roles";

const USERS_STORAGE_KEY = "ceciz_admin_staff_users_v1";
const OPS_PERMS_KEY = "ceciz_admin_perms_ops_v1";
const FIN_PERMS_KEY = "ceciz_admin_perms_fin_v1";

class RolesService {
  private users: StaffUser[];
  private opsPermissions: ModulePermissionRow[];
  private finPermissions: ModulePermissionRow[];

  constructor() {
    this.users = this.loadInitialUsers();
    this.opsPermissions = this.loadInitialOpsPermissions();
    this.finPermissions = this.loadInitialFinPermissions();
  }

  private loadInitialUsers(): StaffUser[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [...MOCK_STAFF_USERS];
  }

  private loadInitialOpsPermissions(): ModulePermissionRow[] {
    try {
      const stored = localStorage.getItem(OPS_PERMS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [...MOCK_OPERATIONS_PERMISSIONS];
  }

  private loadInitialFinPermissions(): ModulePermissionRow[] {
    try {
      const stored = localStorage.getItem(FIN_PERMS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [...MOCK_FINANCE_PERMISSIONS];
  }

  getStaffUsers(): StaffUser[] {
    return [...this.users];
  }

  addStaffUser(data: {
    name: string;
    email: string;
    role: "Owner" | "Operations Staff" | "Finance Staff";
  }): StaffUser {
    const initials = data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newUser: StaffUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "Active",
      lastActive: "Just invited",
      avatarInitials: initials || "ST",
    };

    this.users = [newUser, ...this.users];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch {
      // Ignore
    }
    return newUser;
  }

  updateStaffUser(
    id: string,
    patch: Partial<StaffUser>,
  ): StaffUser | undefined {
    this.users = this.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch {
      // Ignore
    }
    return this.users.find((u) => u.id === id);
  }

  deleteStaffUser(id: string): void {
    this.users = this.users.filter((u) => u.id !== id);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch {
      // Ignore
    }
  }

  getPermissions(
    role: "Operations Staff" | "Finance Staff" = "Operations Staff",
  ): ModulePermissionRow[] {
    if (role === "Finance Staff") {
      return [...this.finPermissions];
    }
    return [...this.opsPermissions];
  }

  savePermissions(
    role: "Operations Staff" | "Finance Staff",
    rows: ModulePermissionRow[],
  ): void {
    if (role === "Finance Staff") {
      this.finPermissions = [...rows];
      try {
        localStorage.setItem(
          FIN_PERMS_KEY,
          JSON.stringify(this.finPermissions),
        );
      } catch {
        // Ignore
      }
    } else {
      this.opsPermissions = [...rows];
      try {
        localStorage.setItem(
          OPS_PERMS_KEY,
          JSON.stringify(this.opsPermissions),
        );
      } catch {
        // Ignore
      }
    }
  }
}

export const rolesService = new RolesService();
export default rolesService;
