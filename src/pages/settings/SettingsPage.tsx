import React, { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LinkCheckoutCard,
  FeeNyelemCard,
  RateHarianCard,
  FeeRekapCard,
  PenaltyRulesCard,
  TaxRateCard,
  StorageDurationCard,
} from "@/components/settings";
import { settingsService } from "@/services/settings.service";
import type {
  AppSettings,
  BuyerCheckoutLinks,
  FeeNyelemSettings,
  DailyRatesSettings,
  FeeRekapSettings,
  PenaltyRulesSettings,
  TaxRateSettings,
  StorageSettings,
} from "@/types/settings";

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() =>
    settingsService.getSettings()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveCheckout = () => {
    setSavingSection("checkout");
    setTimeout(() => {
      settingsService.updateSection("checkoutLinks", settings.checkoutLinks);
      setSavingSection(null);
      showToast("Link checkout buyer berhasil disimpan & diterapkan!");
    }, 300);
  };

  const handleSaveFeeNyelem = () => {
    setSavingSection("feeNyelem");
    setTimeout(() => {
      settingsService.updateSection("feeNyelem", settings.feeNyelem);
      setSavingSection(null);
      showToast("Fee nyelem berhasil disimpan!");
    }, 300);
  };

  const handleSaveDailyRates = () => {
    setSavingSection("dailyRates");
    setTimeout(() => {
      settingsService.updateSection("dailyRates", settings.dailyRates);
      setSavingSection(null);
      showToast("Rate harian berhasil diperbarui!");
    }, 300);
  };

  const handleSaveFeeRekap = () => {
    setSavingSection("feeRekap");
    setTimeout(() => {
      settingsService.updateSection("feeRekap", settings.feeRekap);
      setSavingSection(null);
      showToast("Fee rekap tiered berhasil disimpan!");
    }, 300);
  };

  const handleSavePenaltyRules = () => {
    setSavingSection("penaltyRules");
    setTimeout(() => {
      settingsService.updateSection("penaltyRules", settings.penaltyRules);
      setSavingSection(null);
      showToast("Penalty rules berhasil disimpan!");
    }, 300);
  };

  const handleSaveTaxRate = () => {
    setSavingSection("taxRate");
    setTimeout(() => {
      settingsService.updateSection("taxRate", settings.taxRate);
      setSavingSection(null);
      showToast("Tax rate berhasil disimpan!");
    }, 300);
  };

  const handleSaveStorage = () => {
    setSavingSection("storage");
    setTimeout(() => {
      settingsService.updateSection("storage", settings.storage);
      setSavingSection(null);
      showToast("Maximum storage duration berhasil disimpan!");
    }, 300);
  };

  const handleResetDefaults = () => {
    const defaultData = settingsService.resetToDefault();
    setSettings(defaultData);
    showToast("Semua pengaturan dikembalikan ke default.");
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

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Manage active operational rates, fees, deadlines, and storage rules.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="h-9 px-3 rounded-[10px] text-xs font-semibold border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#EC4899] shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[#71717A]" />
          Reset ke Default
        </Button>
      </div>

      {/* Card 1: Link Checkout Buyer (Full Width) */}
      <LinkCheckoutCard
        data={settings.checkoutLinks}
        onChange={(patch: Partial<BuyerCheckoutLinks>) =>
          setSettings((prev) => ({
            ...prev,
            checkoutLinks: { ...prev.checkoutLinks, ...patch },
          }))
        }
        onSave={handleSaveCheckout}
        isSaving={savingSection === "checkout"}
      />

      {/* 2-Column Grid: Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Row 1: Fee Nyelem & Rate Harian */}
        <FeeNyelemCard
          data={settings.feeNyelem}
          onChange={(patch: Partial<FeeNyelemSettings>) =>
            setSettings((prev) => ({
              ...prev,
              feeNyelem: { ...prev.feeNyelem, ...patch },
            }))
          }
          onSave={handleSaveFeeNyelem}
          isSaving={savingSection === "feeNyelem"}
        />

        <RateHarianCard
          data={settings.dailyRates}
          onChange={(patch: Partial<DailyRatesSettings>) =>
            setSettings((prev) => ({
              ...prev,
              dailyRates: { ...prev.dailyRates, ...patch },
            }))
          }
          onSave={handleSaveDailyRates}
          isSaving={savingSection === "dailyRates"}
        />

        {/* Row 2: Fee Rekap & Penalty Rules */}
        <FeeRekapCard
          data={settings.feeRekap}
          onChange={(patch: Partial<FeeRekapSettings>) =>
            setSettings((prev) => ({
              ...prev,
              feeRekap: { ...prev.feeRekap, ...patch },
            }))
          }
          onSave={handleSaveFeeRekap}
          isSaving={savingSection === "feeRekap"}
        />

        <PenaltyRulesCard
          data={settings.penaltyRules}
          onChange={(patch: Partial<PenaltyRulesSettings>) =>
            setSettings((prev) => ({
              ...prev,
              penaltyRules: { ...prev.penaltyRules, ...patch },
            }))
          }
          onSave={handleSavePenaltyRules}
          isSaving={savingSection === "penaltyRules"}
        />

        {/* Row 3: Tax Rate & Maximum Storage Duration */}
        <TaxRateCard
          data={settings.taxRate}
          onChange={(patch: Partial<TaxRateSettings>) =>
            setSettings((prev) => ({
              ...prev,
              taxRate: { ...prev.taxRate, ...patch },
            }))
          }
          onSave={handleSaveTaxRate}
          isSaving={savingSection === "taxRate"}
        />

        <StorageDurationCard
          data={settings.storage}
          onChange={(patch: Partial<StorageSettings>) =>
            setSettings((prev) => ({
              ...prev,
              storage: { ...prev.storage, ...patch },
            }))
          }
          onSave={handleSaveStorage}
          isSaving={savingSection === "storage"}
        />
      </div>
    </div>
  );
};

export default SettingsPage;

