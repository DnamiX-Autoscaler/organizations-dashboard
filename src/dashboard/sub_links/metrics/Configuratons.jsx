import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import configurationsService from "../../../api/services/metrics/conigurations";

// ── Section wrapper ──────────────────────────────────────────────
const Section = ({ icon, iconColor, title, children }) => (
  <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
    <div className="flex items-center gap-2 mb-4">
      <Icon icon={icon} className={`w-5 h-5 ${iconColor}`} />
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// ── Key-value row ────────────────────────────────────────────────
const KVRow = ({ label, value, mono }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span
      className={`text-sm font-medium text-gray-900 dark:text-white ${mono ? "font-mono" : ""}`}
    >
      {value ?? "-"}
    </span>
  </div>
);

// ── Mode badge ───────────────────────────────────────────────────
const ModeBadge = ({ label, active }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
        active
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-amber-500" : "bg-gray-400"}`}
      />
      {active ? "Enabled" : "Disabled"}
    </span>
  </div>
);

// ── Chip ─────────────────────────────────────────────────────────
const Chip = ({ label, color }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${color}`}
  >
    {label}
  </span>
);

// ─────────────────────────────────────────────────────────────────
const Configuratons = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await configurationsService.getConfig();
      setConfig(data);
      setLastFetched(new Date());
    } catch (err) {
      setError(err?.message ?? "Failed to fetch configuration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <TitleHeader
          title="Runtime Configuration"
          subtitle="Live settings fetched from the backend: Prometheus, collection targets, and test modes"
        />
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 mt-1 text-sm font-medium text-white transition-all rounded-lg shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            icon="mdi:refresh"
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Last fetched */}
      {lastFetched && !loading && (
        <div className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-green-700 dark:text-green-400">
            Last fetched: {lastFetched.toLocaleString()}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Icon
            icon="mdi:loading"
            className="w-8 h-8 animate-spin text-primary"
          />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <Icon
            icon="mdi:alert-circle"
            className="w-5 h-5 text-red-500 shrink-0"
          />
          <span className="text-sm text-red-700 dark:text-red-400">
            {error}
          </span>
        </div>
      )}

      {/* Config sections */}
      {!loading && config && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Prometheus */}
          <Section
            icon="mdi:fire"
            iconColor="text-orange-500"
            title="Prometheus"
          >
            <KVRow label="URL" value={config.prometheus?.url} mono />
            <KVRow
              label="Scrape Interval"
              value={
                config.prometheus?.scrape_interval_seconds != null
                  ? `${config.prometheus.scrape_interval_seconds}s`
                  : "-"
              }
            />
          </Section>

          {/* Collection */}
          <Section
            icon="mdi:timer-outline"
            iconColor="text-blue-500"
            title="Collection Settings"
          >
            <KVRow
              label="Collection Window"
              value={
                config.collection_window_seconds != null
                  ? `${config.collection_window_seconds}s`
                  : "-"
              }
            />
          </Section>

          {/* Targets — Namespaces */}
          <Section
            icon="mdi:folder-network-outline"
            iconColor="text-violet-500"
            title="Target Namespaces"
          >
            {config.targets?.namespaces?.length ? (
              <div className="flex flex-wrap gap-2">
                {config.targets.namespaces.map((ns) => (
                  <Chip
                    key={ns}
                    label={ns}
                    color="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No namespaces configured</p>
            )}
          </Section>

          {/* Modes */}
          <Section
            icon="mdi:toggle-switch-outline"
            iconColor="text-amber-500"
            title="Test Modes"
          >
            <ModeBadge
              label="Queue Test Mode"
              active={config.modes?.queue_test_mode}
            />
            <ModeBadge
              label="Error Test Mode"
              active={config.modes?.error_test_mode}
            />
          </Section>

          {/* Targets — Services (full width) */}
          <div className="lg:col-span-2">
            <Section
              icon="mdi:server-network"
              iconColor="text-emerald-500"
              title={`Target Services (${config.targets?.services?.length ?? 0})`}
            >
              {config.targets?.services?.length ? (
                <div className="flex flex-wrap gap-2">
                  {config.targets.services.map((svc) => (
                    <Chip
                      key={svc}
                      label={svc}
                      color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No services configured</p>
              )}
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuratons;
