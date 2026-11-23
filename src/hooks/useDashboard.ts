import { useState, useEffect, useCallback } from "react";
import {
  fetchDashboardDataApi,
  type DashboardDataResult,
} from "@/services/dashboard.service";
import type {
  DashboardMetricStats,
  RecentBatch,
  CountryDistribution,
  PaymentReviewStats,
  ExchangeRates,
  TeamActivityItem,
} from "@/types/dashboard";
import {
  DEFAULT_RATES,
  DEFAULT_METRIC_STATS,
  DEFAULT_RECENT_BATCHES,
  DEFAULT_COUNTRY_DISTRIBUTIONS,
  DEFAULT_PAYMENT_STATS,
  DEFAULT_TEAM_ACTIVITIES,
} from "@/mocks/mockDashboardData";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { settingsService } from "@/services/settings.service";

function parseRateInput(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  if (trimmed.includes(",")) {
    const n = Number(trimmed.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  if (/^\d{1,3}(\.\d{3})+$/.test(trimmed)) {
    const n = Number(trimmed.replace(/\./g, ""));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function useDashboard() {
  const [metricStats, setMetricStats] =
    useState<DashboardMetricStats>(DEFAULT_METRIC_STATS);
  const [recentBatches, setRecentBatches] =
    useState<RecentBatch[]>(DEFAULT_RECENT_BATCHES);
  const [countryDistributions, setCountryDistributions] =
    useState<CountryDistribution[]>(DEFAULT_COUNTRY_DISTRIBUTIONS);
  const [paymentStats, setPaymentStats] =
    useState<PaymentReviewStats>(DEFAULT_PAYMENT_STATS);
  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_RATES);
  const [teamActivities, setTeamActivities] = useState<TeamActivityItem[]>(
    DEFAULT_TEAM_ACTIVITIES,
  );
  const [totalBatchesMonth, setTotalBatchesMonth] = useState<number>(24);
  const [periodLabel, setPeriodLabel] = useState<string>("September · 24 batch");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Memuat...");
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsSyncing(true);
      setError(null);

      const result: DashboardDataResult = await fetchDashboardDataApi();

      setMetricStats(result.metricStats);
      setRecentBatches(result.recentBatches);
      setCountryDistributions(result.countryDistributions);
      setPaymentStats(result.paymentStats);
      setRates(result.rates);
      setTeamActivities(result.teamActivities);
      setTotalBatchesMonth(result.totalBatchesMonth);
      setPeriodLabel(result.periodLabel);
      setIsLiveBackend(result.isLiveBackend);

      // Sinkronkan badge notifikasi verifikasi pembayaran ke store
      const pendingCount = result.metricStats.pendingVerifications;
      if (pendingCount > 0) {
        useNotificationStore.getState().setBadge("verifikasi", pendingCount);
      } else {
        useNotificationStore.getState().clearBadge("verifikasi");
      }

      const now = new Date();
      setLastUpdated(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")} WIB`,
      );
    } catch (err) {
      console.warn("Gagal memuat data live dashboard dari backend, menggunakan fallback data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyinkronkan dengan backend",
      );
      setIsLiveBackend(false);
      const now = new Date();
      setLastUpdated(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")} WIB (Offline)`,
      );
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(true);
  }, [loadDashboardData]);

  const updateRates = async (newRates: ExchangeRates) => {
    const current = settingsService.getSettings().dailyRates;
    const parsedRates = {
      yuan: parseRateInput(newRates.yuan, current.yuan),
      won: parseRateInput(newRates.won, current.won),
      baht: parseRateInput(newRates.baht, current.baht),
      yen: parseRateInput(newRates.yen, current.yen),
    };

    setRates({
      yuan: parsedRates.yuan.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      won: parsedRates.won.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      baht: parsedRates.baht.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      yen: parsedRates.yen.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      checkedTime: newRates.checkedTime,
    });

    await settingsService.updateSectionAsync("dailyRates", parsedRates);
  };

  return {
    metricStats,
    recentBatches,
    countryDistributions,
    paymentStats,
    rates,
    teamActivities,
    totalBatchesMonth,
    periodLabel,
    isLoading,
    isSyncing,
    isLiveBackend,
    lastUpdated,
    error,
    refetch: () => loadDashboardData(false),
    updateRates,
  };
}

