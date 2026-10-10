import React from "react";
import { Mail } from "lucide-react";
import { GoogleIcon } from "../../components/icons/GoogleIcon";

export const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    // Handler untuk integrasi Better Auth nantinya
    console.log("Login dengan Google diklik");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDF2F8] flex items-center justify-center p-4 overflow-hidden selection:bg-[#FCE7F3] selection:text-[#EC4899]">
      {/* Background Soft Glow Ambient */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FBCFE8]/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-2/4 w-80 h-80 rounded-full bg-[#FED7AA]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-48 right-10 w-96 h-96 rounded-full bg-[#E9D5FF]/50 blur-3xl pointer-events-none" />

      {/* Login Card (Surface) */}
      <div className="z-10 w-full max-w-[420px] bg-white rounded-[24px] shadow-ceciz-surface border border-[#FBCFE8]/50 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#18181B] tracking-tight">
            Ceciz GO Admin
          </h1>
          <p className="text-[14px] text-[#71717A] mt-1.5">Semangat 😊</p>
        </div>

        {/* Action Button: Lanjutkan dengan Google */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-11 rounded-[12px] border border-[#FBCFE8] hover:border-[#DB2777] bg-white hover:bg-[#FCE7F3] active:bg-[#FCE7F3] focus-ceciz-ring text-[14px] font-medium text-[#18181B] flex items-center justify-center gap-3 transition-colors duration-150 cursor-pointer shadow-xs"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Lanjutkan dengan Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-[#FCE7F3]" />

        {/* Info Note Sub-panel */}
        <div className="bg-[#FFF5FA] border border-[#FBCFE8] rounded-[12px] px-4 py-3.5 flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-[#EC4899] shrink-0" />
          <p className="text-[13px] text-[#71717A] leading-tight">
            Gunakan akun Google yang terdaftar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
