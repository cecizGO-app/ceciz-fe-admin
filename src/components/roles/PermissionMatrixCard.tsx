import React from "react";
import { Save, Lock, Shield } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ModulePermissionRow } from "@/types/roles";

interface PermissionMatrixCardProps {
  selectedRole?: "Operations Staff" | "Finance Staff";
  onChangeRole?: (role: "Operations Staff" | "Finance Staff") => void;
  permissions: ModulePermissionRow[];
  onToggle: (
    moduleId: string,
    field: "view" | "create" | "edit" | "delete",
  ) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const PermissionMatrixCard: React.FC<PermissionMatrixCardProps> = ({
  selectedRole = "Operations Staff",
  onChangeRole,
  permissions,
  onToggle,
  onSave,
  isSaving = false,
}) => {
  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-[#FBCFE8]/30 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
              Permission Matrix
            </CardTitle>
            <span className="text-[11px] font-semibold text-[#EC4899] bg-[#FFF5FA] border border-[#FBCFE8] px-2 py-0.5 rounded-full">
              {selectedRole}
            </span>
          </div>
          <CardDescription className="text-xs text-[#71717A] mt-0.5">
            {selectedRole} · module-level permissions
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Switcher Pill (Operations Staff vs Finance Staff) */}
          {onChangeRole && (
            <div className="flex items-center p-0.5 bg-[#FFF5FA] border border-[#FBCFE8]/80 rounded-[12px] shadow-2xs">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onChangeRole("Operations Staff")}
                className={cn(
                  "rounded-[8px] px-3 h-7.5 text-xs font-semibold transition-all cursor-pointer",
                  selectedRole === "Operations Staff"
                    ? "bg-[#EC4899] text-white shadow-xs hover:bg-[#EC4899] hover:text-white"
                    : "text-[#71717A] hover:text-[#18181B] hover:bg-transparent",
                )}
              >
                <Shield className="w-3 h-3 mr-1" />
                Operations Staff
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onChangeRole("Finance Staff")}
                className={cn(
                  "rounded-[8px] px-3 h-7.5 text-xs font-semibold transition-all cursor-pointer",
                  selectedRole === "Finance Staff"
                    ? "bg-[#EC4899] text-white shadow-xs hover:bg-[#EC4899] hover:text-white"
                    : "text-[#71717A] hover:text-[#18181B] hover:bg-transparent",
                )}
              >
                <Shield className="w-3 h-3 mr-1" />
                Finance Staff
              </Button>
            </div>
          )}

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="h-8.5 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs cursor-pointer disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save changes
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#FFF5FA]/60">
            <TableRow className="border-[#FBCFE8]/30 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-[#18181B] pl-6 py-3.5 w-1/3">
                Module
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-center w-1/6">
                View
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-center w-1/6">
                Create
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-center w-1/6">
                Edit
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-center w-1/6 pr-6">
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {permissions.map((row) => {
              const isLocked = Boolean(row.isOwnerOnly);

              return (
                <TableRow
                  key={row.moduleId}
                  className={`border-[#FBCFE8]/30 transition-colors ${
                    isLocked
                      ? "bg-zinc-50/50 opacity-70"
                      : "hover:bg-[#FFF5FA]/40"
                  }`}
                >
                  <TableCell className="font-semibold text-xs text-[#18181B] pl-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span>{row.moduleName}</span>
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-normal text-[#71717A] bg-zinc-100 px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" />
                          Owner Only
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* View column */}
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={row.view}
                        disabled={isLocked}
                        onCheckedChange={() => onToggle(row.moduleId, "view")}
                        className="rounded-full size-5 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Toggle view for ${row.moduleName}`}
                      />
                    </div>
                  </TableCell>

                  {/* Create column */}
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={row.create}
                        disabled={isLocked}
                        onCheckedChange={() => onToggle(row.moduleId, "create")}
                        className="rounded-full size-5 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Toggle create for ${row.moduleName}`}
                      />
                    </div>
                  </TableCell>

                  {/* Edit column */}
                  <TableCell className="text-center py-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={row.edit}
                        disabled={isLocked}
                        onCheckedChange={() => onToggle(row.moduleId, "edit")}
                        className="rounded-full size-5 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Toggle edit for ${row.moduleName}`}
                      />
                    </div>
                  </TableCell>

                  {/* Delete column */}
                  <TableCell className="text-center py-3 pr-6">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={row.delete}
                        disabled={isLocked}
                        onCheckedChange={() => onToggle(row.moduleId, "delete")}
                        className="rounded-full size-5 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Toggle delete for ${row.moduleName}`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PermissionMatrixCard;
