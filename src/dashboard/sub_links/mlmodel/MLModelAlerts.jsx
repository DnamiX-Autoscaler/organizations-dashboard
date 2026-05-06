import React, { useMemo } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import AlertsPanel from "../../../components/mlmodel/AlertsPanel";
import useMLModel from "../../../services/useMLModel";

const LEVEL_CONFIG = {
    critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", icon: "mdi:alert-circle" },
    warning: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", icon: "mdi:alert" },
    info: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", icon: "mdi:information" },
};

const MLModelAlerts = () => {
    const { alerts } = useMLModel();

    const counts = useMemo(() => {
        const c = { critical: 0, warning: 0, info: 0 };
        alerts.forEach((a) => { if (c[a.level] !== undefined) c[a.level]++; });
        return c;
    }, [alerts]);

    const summaryCards = [
        { level: "critical", label: "Critical", count: counts.critical },
        { level: "warning", label: "Warnings", count: counts.warning },
        { level: "info", label: "Info", count: counts.info },
        { level: null, label: "Total", count: alerts.length, icon: "mdi:bell-outline", color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-700/30", border: "border-gray-200 dark:border-gray-700" },
    ];

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Alert Center"
                subtitle="Auto-generated alerts from live model predictions, resource usage, and error rates"
            />

            {/* Summary row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {summaryCards.map((s, i) => {
                    const cfg = s.level ? LEVEL_CONFIG[s.level] : null;
                    return (
                        <div
                            key={i}
                            className={`p-4 rounded-xl border flex items-center gap-4 ${
                                cfg ? `${cfg.bg} ${cfg.border}` : `${s.bg} ${s.border}`
                            }`}
                        >
                            <Icon
                                icon={cfg ? cfg.icon : s.icon}
                                className={`w-8 h-8 ${cfg ? cfg.color : s.color}`}
                            />
                            <div>
                                <p className={`text-xs font-medium ${cfg ? cfg.color : s.color}`}>{s.label}</p>
                                <p className={`text-2xl font-bold ${cfg ? cfg.color : s.color}`}>{s.count}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {alerts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500 space-y-3">
                    <Icon icon="mdi:bell-sleep-outline" className="w-16 h-16 opacity-40" />
                    <p className="text-lg font-medium">No alerts yet</p>
                    <p className="text-sm">The system will generate alerts as the simulation runs.</p>
                </div>
            )}

            {/* Full alerts panel */}
            {alerts.length > 0 && <AlertsPanel alerts={alerts} />}
        </div>
    );
};

export default MLModelAlerts;
