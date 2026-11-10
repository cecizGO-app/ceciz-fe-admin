import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StaffAccountsCard,
  PermissionMatrixCard,
  AddStaffModal,
  EditStaffModal,
} from "@/components/roles";
import { rolesService } from "@/services/roles.service";
import type { StaffUser, ModulePermissionRow } from "@/types/roles";

export const RolesPermissionsPage: React.FC = () => {
  const [users, setUsers] = useState<StaffUser[]>(() =>
    rolesService.getStaffUsers(),
  );
  const [matrixRole, setMatrixRole] = useState<
    "Operations Staff" | "Finance Staff"
  >("Operations Staff");
  const [permissions, setPermissions] = useState<ModulePermissionRow[]>(() =>
    rolesService.getPermissions("Operations Staff"),
  );

  const handleRoleChange = (role: "Operations Staff" | "Finance Staff") => {
    setMatrixRole(role);
    setPermissions(rolesService.getPermissions(role));
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingMatrix, setIsSavingMatrix] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddStaff = (data: {
    name: string;
    email: string;
    role: "Operations Staff" | "Finance Staff";
  }) => {
    const newUser = rolesService.addStaffUser(data);
    setUsers(rolesService.getStaffUsers());
    showToast(`Undangan untuk "${newUser.name}" berhasil dikirim!`);
  };

  const handleEditUser = (user: StaffUser) => {
    setEditingUser(user);
  };

  const handleSaveEditUser = (id: string, patch: Partial<StaffUser>) => {
    rolesService.updateStaffUser(id, patch);
    setUsers(rolesService.getStaffUsers());
    showToast("Informasi staff berhasil diperbarui!");
  };

  const handleToggleStatus = (user: StaffUser) => {
    const nextStatus = user.status === "Active" ? "Disabled" : "Active";
    rolesService.updateStaffUser(user.id, { status: nextStatus });
    setUsers(rolesService.getStaffUsers());
    showToast(`Status akun "${user.name}" diubah menjadi ${nextStatus}.`);
  };

  const handleDeleteUser = (id: string) => {
    rolesService.deleteStaffUser(id);
    setUsers(rolesService.getStaffUsers());
    showToast("Akun staff berhasil dihapus.");
  };

  const handleTogglePermission = (
    moduleId: string,
    field: "view" | "create" | "edit" | "delete",
  ) => {
    setPermissions((prev) =>
      prev.map((row) => {
        if (row.moduleId === moduleId && !row.isOwnerOnly) {
          return { ...row, [field]: !row[field] };
        }
        return row;
      }),
    );
  };

  const handleSavePermissions = () => {
    setIsSavingMatrix(true);
    setTimeout(() => {
      rolesService.savePermissions(matrixRole, permissions);
      setIsSavingMatrix(false);
      showToast(`Permission matrix untuk "${matrixRole}" berhasil disimpan!`);
    }, 350);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Toast Notifikasi Ringkas */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#18181B] text-white px-4 py-2.5 rounded-[12px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman Sesuai Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Manage internal staff access without exposing owner-only modules.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Staff
        </Button>
      </div>

      {/* Card 1: Staff Accounts Table */}
      <StaffAccountsCard
        users={users}
        onEditUser={handleEditUser}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
      />

      {/* Card 2: Permission Matrix */}
      <PermissionMatrixCard
        selectedRole={matrixRole}
        onChangeRole={handleRoleChange}
        permissions={permissions}
        onToggle={handleTogglePermission}
        onSave={handleSavePermissions}
        isSaving={isSavingMatrix}
      />

      {/* Modal: Add Staff Account */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStaff={handleAddStaff}
      />

      {/* Modal: Edit Staff Account */}
      <EditStaffModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEditUser}
      />
    </div>
  );
};

export default RolesPermissionsPage;
