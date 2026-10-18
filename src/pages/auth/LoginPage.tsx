import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  CheckCircle2,
  User,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/schemas/auth.schema";

interface LoginPageProps {
  onLoginSuccess?: (role: "owner" | "staff") => void;
}

interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "owner" | "staff";
  roleLabel: string;
  avatarColor: string;
}

const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: "acc_owner",
    name: "Aurel (Owner)",
    email: "aurel.owner@gmail.com",
    username: "owner",
    role: "owner",
    roleLabel: "Owner (Akses Penuh)",
    avatarColor: "from-pink-500 to-rose-400 text-white",
  },
  {
    id: "acc_staff",
    name: "Staff Operasional",
    email: "staff.ceciz@gmail.com",
    username: "staff",
    role: "staff",
    roleLabel: "Staff Operasional",
    avatarColor: "from-pink-400 to-purple-400 text-white",
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<"initial" | "registered-account">("initial");
  const [selectedAccountId, setSelectedAccountId] =
    useState<string>("acc_owner");
  const [isManualInput, setIsManualInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const selectedAccount =
    REGISTERED_ACCOUNTS.find((a) => a.id === selectedAccountId) ||
    REGISTERED_ACCOUNTS[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: selectedAccount.email,
      password: "",
      rememberMe: false,
    },
  });

  const handleSelectAccount = (account: RegisteredAccount) => {
    setSelectedAccountId(account.id);
    setIsManualInput(false);
    setValue("username", account.email);
    setAuthError(null);
  };

  const handleOpenRegisteredView = () => {
    setValue("username", selectedAccount.email);
    setView("registered-account");
  };

  const onSubmit = async (data: AdminLoginFormValues) => {
    setAuthError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const role: "owner" | "staff" = isManualInput
        ? data.username.toLowerCase().includes("staff")
          ? "staff"
          : "owner"
        : selectedAccount.role;

      if (onLoginSuccess) {
        onLoginSuccess(role);
      } else {
        console.log("Login sukses:", {
          username: data.username,
          rememberMe,
          role,
        });
      }
    } catch {
      setAuthError("Gagal masuk. Periksa username dan password Anda.");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDF2F8] flex items-center justify-center p-4 overflow-hidden selection:bg-[#FCE7F3] selection:text-[#EC4899]">
      {/* Background Soft Glow Ambient */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FBCFE8]/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-2/4 w-80 h-80 rounded-full bg-[#FED7AA]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-10 w-96 h-96 rounded-full bg-[#E9D5FF]/50 blur-3xl pointer-events-none" />

      {/* Login Card (Surface) */}
      <Card className="z-10 w-full max-w-[420px] p-8 sm:p-10 border-[#FBCFE8]/50 gap-0 transition-all duration-300">
        {view === "initial" ? (
          /* ========================================================= */
          /* TAMPILAN AWAL (100% PERSIS SESUAI DESIGN ASLI)             */
          /* ========================================================= */
          <>
            {/* Header */}
            <div className="text-center">
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#18181B] tracking-tight">
                Ceciz GO Admin
              </h1>
              <p className="text-[14px] text-[#71717A] mt-1.5">Semangat 😊</p>
            </div>

            {/* Action Button: Lanjutkan dengan Google */}
            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenRegisteredView}
                className="w-full h-11 rounded-[12px] border-[#FBCFE8] hover:border-[#DB2777] bg-white hover:bg-[#FCE7F3] active:bg-[#FCE7F3] text-[14px] font-medium text-[#18181B] flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Lanjutkan dengan Google</span>
              </Button>
            </div>

            {/* Divider */}
            <Separator className="my-5" />

            {/* Info Note Sub-panel (Dapat Diklik untuk Membuka Desain Akun Terdaftar) */}
            <button
              type="button"
              onClick={handleOpenRegisteredView}
              className="w-full text-left bg-[#FFF5FA] hover:bg-[#FCE7F3]/70 border border-[#FBCFE8] hover:border-[#EC4899]/50 rounded-[12px] px-4 py-3.5 flex items-center justify-between gap-2.5 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-[#EC4899] shrink-0" />
                <p className="text-[13px] text-[#71717A] group-hover:text-[#18181B] leading-tight transition-colors">
                  Gunakan akun Google yang terdaftar.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#EC4899] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </>
        ) : (
          /* ========================================================= */
          /* TAMPILAN SAAT MENCET AKUN YANG TERDAFTAR                 */
          /* ========================================================= */
          <div className="animate-in fade-in-50 duration-200">
            {/* Navigasi Kembali */}
            <button
              type="button"
              onClick={() => {
                setAuthError(null);
                setView("initial");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#EC4899] transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>

            {/* Header View Akun Terdaftar */}
            <div className="mb-5">
              <h2 className="text-[20px] font-bold text-[#18181B] tracking-tight">
                Akun Terdaftar
              </h2>
              <p className="text-xs text-[#71717A] mt-1">
                Pilih akun Google Anda yang terdaftar di Ceciz GO Admin
              </p>
            </div>

            {/* Global Error Banner */}
            {authError && (
              <div className="mb-4 p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            {/* List Pilihan Akun Google yang Terdaftar */}
            <div className="space-y-2.5 mb-5">
              {REGISTERED_ACCOUNTS.map((acc) => {
                const isSelected =
                  !isManualInput && selectedAccountId === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full text-left p-3 rounded-[12px] border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#FFF5FA] border-[#EC4899] ring-2 ring-[#EC4899]/20 shadow-xs"
                        : "bg-white border-[#FBCFE8] hover:border-[#EC4899]/50 hover:bg-[#FFF5FA]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-tr ${acc.avatarColor} flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs`}
                      >
                        {acc.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#18181B] truncate">
                            {acc.name}
                          </span>
                          <Badge
                            variant={
                              acc.role === "owner" ? "secondary" : "outline"
                            }
                            className="text-[10px] px-1.5 py-0 h-4 font-semibold"
                          >
                            {acc.role.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-[#71717A] truncate mt-0.5">
                          {acc.email}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#EC4899] shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Opsi Masukkan Username / Email Manual */}
              <button
                type="button"
                onClick={() => {
                  setIsManualInput(true);
                  setValue("username", "");
                  setAuthError(null);
                }}
                className={`w-full text-left p-3 rounded-[12px] border transition-all flex items-center gap-3 cursor-pointer ${
                  isManualInput
                    ? "bg-[#FFF5FA] border-[#EC4899] ring-2 ring-[#EC4899]/20 shadow-xs"
                    : "bg-white border-[#FBCFE8] hover:border-[#EC4899]/50 hover:bg-[#FFF5FA]/40 text-[#71717A]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#18181B]">
                    Gunakan Akun / Username Lain
                  </span>
                  <p className="text-[11px] text-[#71717A] truncate mt-0.5">
                    Input username atau email staff secara manual
                  </p>
                </div>
              </button>
            </div>

            {/* Form Input Password Menggunakan Komponen shadcn */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Jika pilih input manual, munculkan input username */}
              {isManualInput && (
                <div className="space-y-1.5 animate-in fade-in-50 duration-150">
                  <Label
                    htmlFor="username"
                    className="text-xs font-semibold text-[#18181B]"
                  >
                    Username / Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Contoh: staff.ceciz@gmail.com"
                    className="h-11 text-xs"
                    aria-invalid={!!errors.username}
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.username.message}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Input Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-[#18181B]"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() =>
                      alert("Silakan hubungi Owner untuk reset password.")
                    }
                    className="text-[11px] font-medium text-[#EC4899] hover:text-[#DB2777] transition-colors cursor-pointer"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password akun"
                    className="pl-10 pr-10 h-11 text-xs"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] p-1 rounded transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Lihat password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-xs text-[#71717A] font-normal cursor-pointer select-none mb-0 leading-none"
                >
                  Ingat saya di perangkat ini
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] active:bg-[#BE185D] text-white font-semibold text-xs gap-2 shadow-xs transition-all cursor-pointer mt-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
