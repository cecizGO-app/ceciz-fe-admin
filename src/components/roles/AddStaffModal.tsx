import React, { useState } from "react";
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

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (data: {
    name: string;
    email: string;
    role: "Operations Staff" | "Finance Staff";
  }) => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onAddStaff,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Operations Staff" | "Finance Staff">(
    "Operations Staff"
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Nama lengkap staff wajib diisi.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Alamat email tidak valid.");
      return;
    }

    onAddStaff({
      name: fullName.trim(),
      email: email.trim(),
      role,
    });

    setFullName("");
    setEmail("");
    setRole("Operations Staff");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-[20px] border-[#FBCFE8]">
        <DialogHeader className="pb-3 border-b border-[#FBCFE8]/30">
          <DialogTitle className="text-[18px] font-bold text-[#18181B]">
            Add Staff Account
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A]">
            Invite a team member and choose their starting role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-2.5 rounded-[10px] bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Full name
            </Label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Staff name"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="name@cecizgo.id"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Role
            </Label>
            <Select
              value={role}
              onValueChange={(val) =>
                setRole(val as "Operations Staff" | "Finance Staff")
              }
            >
              <SelectTrigger className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operations Staff">Operations Staff</SelectItem>
                <SelectItem value="Finance Staff">Finance Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-3 border-t border-[#FBCFE8]/30 flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 rounded-[10px] text-xs font-semibold border-[#FBCFE8]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs"
            >
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

