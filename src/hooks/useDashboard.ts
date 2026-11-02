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
} from "@/types/dashboard";
import {
  DEFAULT_RATES,
  DEFAULT_METRIC_STATS,
  DEFAULT_RECENT_BATCHES,
  DEFAULT_COUNTRY_DISTRIBUTIONS,
  DEFAULT_PAYMENT_STATS,
} from "@/mocks/mockDashboardData";
import { useNotificationStore } from "@/stores/useNotificationStore";

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

  const updateRates = (newRates: ExchangeRates) => {
    setRates(newRates);
  };

  return {
    metricStats,
    recentBatches,
    countryDistributions,
    paymentStats,
    rates,
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

