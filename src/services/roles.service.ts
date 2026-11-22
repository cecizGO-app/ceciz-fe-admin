import {
  MOCK_STAFF_USERS,
  MOCK_OPERATIONS_PERMISSIONS,
  MOCK_FINANCE_PERMISSIONS,
} from "@/mocks/mockRolesData";
import type { StaffUser, ModulePermissionRow } from "@/types/roles";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

const USERS_STORAGE_KEY = "ceciz_admin_staff_users_v1";
const OPS_PERMS_KEY = "ceciz_admin_perms_ops_v1";
const FIN_PERMS_KEY = "ceciz_admin_perms_fin_v1";

function toInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST"
  );
}

function mapBackendStaffToFrontend(raw: Record<string, unknown>): StaffUser {
  const name = String(raw.name ?? "Staff");
  const backendRole = String(raw.role ?? "STAFF").toUpperCase();
  const title = String(raw.staffTitle ?? "");
  let roleLabel: StaffUser["role"] = "Operations Staff";
  if (backendRole === "OWNER") roleLabel = "Owner";
  else if (title.toLowerCase().includes("finance")) roleLabel = "Finance Staff";

  return {
    id: String(raw.id ?? ""),
    name,
    email: String(raw.email ?? ""),
    role: roleLabel,
    status: raw.isActive === false ? "Disabled" : "Active",
    lastActive: raw.updatedAt
      ? new Date(String(raw.updatedAt)).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Active",
    avatarInitials: toInitials(name),
  };
}

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

  private persistUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch {
      // Ignore
    }
  }

  getStaffUsers(): StaffUser[] {
    return [...this.users];
  }

  async fetchStaffUsersApi(): Promise<StaffUser[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/roles/staff`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rawList = Array.isArray(json?.data) ? json.data : [];
      if (rawList.length > 0) {
        this.users = rawList.map(mapBackendStaffToFrontend);
        this.persistUsers();
      }
    } catch {
      // Fallback ke local cache
    }
    return [...this.users];
  }

  addStaffUser(data: {
    name: string;
    email: string;
    role: "Owner" | "Operations Staff" | "Finance Staff";
  }): StaffUser {
    const newUser: StaffUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "Active",
      lastActive: "Just invited",
      avatarInitials: toInitials(data.name),
    };

    this.users = [newUser, ...this.users];
    this.persistUsers();

    // Sinkronkan ke backend API (non-blocking)
    fetch(`${BASE_URL}/api/v1/admin/roles/staff`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role === "Owner" ? "OWNER" : "STAFF",
        staffTitle: data.role,
        isActive: true,
      }),
    }).catch(() => {});

    return newUser;
  }

  updateStaffUser(
    id: string,
    patch: Partial<StaffUser>,
  ): StaffUser | undefined {
    this.users = this.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    this.persistUsers();

    fetch(`${BASE_URL}/api/v1/admin/roles/staff/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(patch.name ? { name: patch.name } : {}),
        ...(patch.role
          ? {
              role: patch.role === "Owner" ? "OWNER" : "STAFF",
              staffTitle: patch.role,
            }
          : {}),
        ...(patch.status ? { isActive: patch.status === "Active" } : {}),
      }),
    }).catch(() => {});

    return this.users.find((u) => u.id === id);
  }

  deleteStaffUser(id: string): void {
    this.users = this.users.filter((u) => u.id !== id);
    this.persistUsers();

    fetch(`${BASE_URL}/api/v1/admin/roles/staff/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
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
    updated: ModulePermissionRow[],
  ): ModulePermissionRow[] {
    if (role === "Finance Staff") {
      this.finPermissions = [...updated];
      try {
        localStorage.setItem(FIN_PERMS_KEY, JSON.stringify(this.finPermissions));
      } catch {
        // Ignore
      }
    } else {
      this.opsPermissions = [...updated];
      try {
        localStorage.setItem(OPS_PERMS_KEY, JSON.stringify(this.opsPermissions));
      } catch {
        // Ignore
      }
    }

    const permMap: Record<
      string,
      { view: boolean; create: boolean; edit: boolean; delete: boolean }
    > = {};
    for (const row of updated) {
      permMap[row.moduleId] = {
        view: row.view,
        create: row.create,
        edit: row.edit,
        delete: row.delete,
      };
    }

    fetch(`${BASE_URL}/api/v1/admin/roles/permissions`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleKey: role === "Finance Staff" ? "FINANCE_STAFF" : "OPERATIONS_STAFF",
        label: role,
        permissions: permMap,
      }),
    }).catch(() => {});

    return [...updated];
  }
}

export const rolesService = new RolesService();
export default rolesService;
