import React, { useState } from "react";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient, type AuthUser } from "@/lib/auth-client";

interface LoginPageProps {
  onLoginSuccess?: (role: "owner" | "staff", user?: AuthUser) => void;
  initialError?: string | null;
  onClearError?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialError,
  onClearError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const displayError = initialError || errorMsg;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    if (onClearError) onClearError();
    setIsLoading(true);

    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });

      if (res?.error) {
        setErrorMsg(
          res.error.message ||
            "Gagal menghubungkan ke layanan Google OAuth. Silakan coba kembali.",
        );
      }
    } catch (err: unknown) {
      console.error("Google login error:", err);
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setErrorMsg(
          "Tidak dapat terhubung ke server backend (https://ceciz-backend.vercel.app). Pastikan koneksi internet stabil.",
        );
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat masuk dengan Google.";
        setErrorMsg(msg);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDF2F8] flex items-center justify-center p-4 overflow-hidden selection:bg-[#FCE7F3] selection:text-[#EC4899]">
      {/* Background Soft Glow Ambient */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FBCFE8]/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-2/4 w-80 h-80 rounded-full bg-[#FED7AA]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-10 w-96 h-96 rounded-full bg-[#E9D5FF]/50 blur-3xl pointer-events-none" />

      {/* Login Card (Surface) */}
      <Card className="z-10 w-full max-w-[420px] p-8 sm:p-10 border-[#FBCFE8]/50 gap-0">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#18181B] tracking-tight">
            Ceciz GO Admin
          </h1>
          <p className="text-[14px] text-[#71717A] mt-1.5">Semangat 😊</p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div
            role="alert"
            className="mt-5 p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-snug">{displayError}</span>
          </div>
        )}

        {/* Action Button: Lanjutkan dengan Google */}
        <div className="mt-8">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className="w-full h-11 rounded-[12px] border-[#FBCFE8] hover:border-[#DB2777] bg-white hover:bg-[#FCE7F3] active:bg-[#FCE7F3] text-[14px] font-medium text-[#18181B] flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#EC4899]" />
                <span>Menghubungkan ke Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Lanjutkan dengan Google</span>
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <Separator className="my-5" />

        {/* Info Note Sub-panel */}
        <div className="bg-[#FFF5FA] border border-[#FBCFE8] rounded-[12px] px-4 py-3.5 flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-[#EC4899] shrink-0" />
          <p className="text-[13px] text-[#71717A] leading-tight">
            Gunakan akun Google yang terdaftar.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
