import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/schemas/auth.schema";
import {
  authClient,
  type AuthUser,
  mapBackendRoleToFrontend,
} from "@/lib/auth-client";

interface LoginPageProps {
  onLoginSuccess?: (role: "owner" | "staff", user?: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setAuthError(null);
    try {
      const email = data.email.trim().toLowerCase();
      const password = data.password;

      // Better Auth Sign-In with Email & Password
      const response = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (response.error) {
        const err = response.error;
        if (err.code === "INVALID_EMAIL_OR_PASSWORD" || err.status === 401) {
          setAuthError("Email atau password yang Anda masukkan salah.");
        } else if (err.code === "EMAIL_PASSWORD_DISABLED") {
          setAuthError("Fitur email & password belum aktif di backend.");
        } else if (err.code === "INVALID_ORIGIN" || err.status === 403) {
          setAuthError(
            `Origin browser (${window.location.origin}) belum diizinkan oleh backend CORS.`,
          );
        } else {
          setAuthError(
            err.message || "Gagal masuk. Periksa kembali akun Anda.",
          );
        }
        return;
      }

      // Check role permissions (RBAC)
      const user = response.data?.user as AuthUser | undefined;
      const backendRole = user?.role;

      if (backendRole && backendRole.toUpperCase() === "BUYER") {
        await authClient.signOut();
        setAuthError(
          "Akses Ditolak: Akun Anda terdaftar sebagai BUYER. Dashboard Admin hanya untuk OWNER dan STAFF.",
        );
        return;
      }

      const assignedRole =
        mapBackendRoleToFrontend(backendRole) ||
        (email.includes("staff") ? "staff" : "owner");

      if (onLoginSuccess) {
        onLoginSuccess(assignedRole, user);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setAuthError(
          "Tidak dapat terhubung ke backend (http://localhost:3005). Pastikan server backend sedang aktif.",
        );
      } else {
        const msg =
          err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
        setAuthError(msg);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDF2F8] flex items-center justify-center p-4 overflow-hidden selection:bg-[#FCE7F3] selection:text-[#EC4899]">
      {/* Background Soft Glow Ambient */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FBCFE8]/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-2/4 w-80 h-80 rounded-full bg-[#FED7AA]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-10 w-96 h-96 rounded-full bg-[#E9D5FF]/50 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <Card className="z-10 w-full max-w-[400px] p-8 sm:p-10 border-[#FBCFE8]/60 rounded-2xl bg-white shadow-xl gap-0 transition-all duration-300">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#18181B] tracking-tight">
            Ceciz GO Admin
          </h1>
          <p className="text-[14px] text-[#71717A] mt-1.5">Semangat 😊</p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div
            role="alert"
            className="mt-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        {/* Form Login (Email & Password Murni) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          {/* Input Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-[#18181B]"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="username"
                enterKeyHint="next"
                required
                placeholder="nama@email.com"
                className="pl-10 h-11 text-xs rounded-xl border-[#FBCFE8]/80 focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/15"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p
                className="text-[11px] font-medium text-rose-600 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="current-password"
                className="text-xs font-semibold text-[#18181B]"
              >
                Password
              </Label>
              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  alert("Silakan hubungi Owner untuk reset password akun Anda.")
                }
                className="text-[11px] font-medium text-[#EC4899] hover:text-[#DB2777] transition-colors cursor-pointer"
              >
                Lupa password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                enterKeyHint="done"
                required
                placeholder="Masukkan password akun"
                className="pl-10 pr-10 h-11 text-xs rounded-xl border-[#FBCFE8]/80 focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/15"
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
              <p
                className="text-[11px] font-medium text-rose-600 flex items-center gap-1"
                role="alert"
              >
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
              className="text-xs text-[#71717A] font-normal cursor-pointer select-none leading-none"
            >
              Ingat saya di perangkat ini
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] active:bg-[#BE185D] text-white font-semibold text-xs gap-2 shadow-sm transition-all cursor-pointer mt-2"
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
      </Card>
    </div>
  );
};

export default LoginPage;
