import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StaffUser } from "@/types/roles";

interface EditStaffModalProps {
  user: StaffUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, patch: Partial<StaffUser>) => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffUser["role"]>("Operations Staff");
  const [status, setStatus] = useState<StaffUser["status"]>("Active");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(user.id, {
      name: name.trim(),
      role,
      status,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-[20px] border-[#FBCFE8]">
        <DialogHeader className="pb-3 border-b border-[#FBCFE8]/30">
          <DialogTitle className="text-[18px] font-bold text-[#18181B]">
            Edit Staff: {user.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A]">
            Perbarui informasi role atau status akun staff.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Nama Lengkap
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Email (read-only)
            </Label>
            <Input
              type="email"
              disabled
              value={user.email}
              className="h-10 text-xs rounded-[10px] bg-zinc-50 border-zinc-200 text-[#71717A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(val) => setRole(val as StaffUser["role"])}
              >
                <SelectTrigger className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Operations Staff">Operations Staff</SelectItem>
                  <SelectItem value="Finance Staff">Finance Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as StaffUser["status"])}
              >
                <SelectTrigger className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-[#FBCFE8]/30 flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 rounded-[10px] text-xs font-semibold border-[#FBCFE8]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

