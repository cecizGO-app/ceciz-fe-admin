import React, { useState } from "react";
import { MoreHorizontal, UserCheck, UserX, Trash2 } from "lucide-react";
import { TablePagination } from "@/components/verification/TablePagination";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StaffUser } from "@/types/roles";

interface StaffAccountsCardProps {
  users: StaffUser[];
  onEditUser: (user: StaffUser) => void;
  onToggleStatus: (user: StaffUser) => void;
  onDeleteUser: (id: string) => void;
}

const STAFF_PAGE_SIZE = 10;

export const StaffAccountsCard: React.FC<StaffAccountsCardProps> = ({
  users,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / STAFF_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = users.length === 0 ? 0 : (safePage - 1) * STAFF_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * STAFF_PAGE_SIZE, users.length);
  const paginatedUsers = users.slice(
    (safePage - 1) * STAFF_PAGE_SIZE,
    safePage * STAFF_PAGE_SIZE,
  );

  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-[#FBCFE8]/30">
        <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
          Staff Accounts
        </CardTitle>
        <CardDescription className="text-xs text-[#71717A]">
          {users.length} internal users
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#FFF5FA]/60">
            <TableRow className="border-[#FBCFE8]/30 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-[#18181B] pl-6 py-3.5">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Role
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Last active
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-center pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                className="border-[#FBCFE8]/30 hover:bg-[#FFF5FA]/40 transition-colors"
              >
                {/* Name with Avatar Initials */}
                <TableCell className="pl-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-center text-[11px] font-bold text-[#EC4899] shrink-0">
                      {user.avatarInitials}
                    </div>
                    <span className="font-semibold text-xs text-[#18181B]">
                      {user.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-xs text-[#71717A]">
                  {user.email}
                </TableCell>

                <TableCell className="text-xs font-medium text-[#18181B]">
                  {user.role}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={user.status === "Active" ? "success" : "outline"}
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs text-[#71717A]">
                  {user.lastActive}
                </TableCell>

                <TableCell className="text-center pr-6">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => onEditUser(user)}
                      className="h-7 px-3 rounded-[8px] text-[11px] font-semibold border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#EC4899] shadow-2xs"
                    >
                      Edit
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-7 text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B]"
                          title="Menu aksi"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 p-1 rounded-[12px] border-[#FBCFE8] shadow-md text-xs"
                      >
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(user)}
                          className="flex items-center gap-2 cursor-pointer rounded-[8px]"
                        >
                          {user.status === "Active" ? (
                            <>
                              <UserX className="w-3.5 h-3.5 text-amber-600" />
                              <span>Nonaktifkan</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Aktifkan</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        {user.role !== "Owner" && (
                          <DropdownMenuItem
                            onClick={() => onDeleteUser(user.id)}
                            className="flex items-center gap-2 text-rose-600 focus:text-rose-700 cursor-pointer rounded-[8px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Akun</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={safePage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalCount={users.length}
          itemLabel="akun staff"
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};
