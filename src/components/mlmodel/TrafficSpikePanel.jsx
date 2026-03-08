/**
 * TrafficSpikePanel.jsx
 * Traffic scenario selector for the Predictive Autoscaling module.
 * Each scenario routes a real traffic pattern into the inference pipeline
 * and observes how the BiLSTM model adapts its scaling decisions.
 */
import React from "react";
import { Icon } from "@iconify/react";
import useMLModel from "../../services/useMLModel";

const SCENARIOS = [
    {
        type: "flash_sale",
        label: "Flash Sale",
        icon: "mdi:lightning-bolt",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-700",
        activeBg: "bg-amber-500",
        description: "Peak-load pattern · rapid ramp-up, sustained peak, gradual ramp-down",
        rows: 20,
        modelExpect: "The model detects the bell-curve demand pattern and initiates proactive scale-up ahead of the peak. Scaling decisions remain accurate as resource demand follows a predictable distribution.",
        expectedAccuracy: "Good",
        oodExpected: "10–35%",
    },
    {
        type: "gradual_ramp",
        label: "Gradual Ramp",
        icon: "mdi:trending-up",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-700",
        activeBg: "bg-blue-500",
        description: "Sustained growth pattern · steady linear increase in traffic load",
        rows: 25,
        modelExpect: "BiLSTM captures the linear growth trend and anticipates resource demand ahead of time. Proactive scaling decisions prevent latency degradation without over-provisioning.",
        expectedAccuracy: "High",
        oodExpected: "5–25%",
    },
    {
        type: "load_test",
        label: "Load Test",
        icon: "mdi:gauge-full",
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-900/20",
        border: "border-violet-200 dark:border-violet-700",
        activeBg: "bg-violet-500",
        description: "Sustained high-load plateau · flat maximum throughput period",
        rows: 20,
        modelExpect: "Stable high-throughput distribution allows the model to maintain consistent predictions. The inference engine holds the correct pod count throughout the plateau without reactionary scaling.",
        expectedAccuracy: "Good",
        oodExpected: "15–40%",
    },
];

const ACCURACY_BADGE = {
    Poor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    Fair: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    High: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
};

const CONF_CONFIG = {
    High: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", bar: "bg-emerald-500", icon: "mdi:shield-check" },
    Medium: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", bar: "bg-amber-400", icon: "mdi:shield-half-full" },
    Low: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20", bar: "bg-orange-500", icon: "mdi:shield-alert" },
    Critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", bar: "bg-red-500", icon: "mdi:shield-off" },
};

const TrafficSpikePanel = () => {
    const { injectSpike, spikeActive, isSimulating, isApiHealthy, oodScore, modelConfidence, candidatesReady } = useMLModel();
    // Injection only needs the local queue to be loaded (isSimulating).
    // Predictions happen once the remote API is also healthy (isApiHealthy),
    // but row injection is purely a local queue operation.
    const canInject = isSimulating;
    const apiPending = isSimulating && !isApiHealthy;
    const activeScenario = SCENARIOS.find((s) => s.type === spikeActive);
    const confCfg = CONF_CONFIG[modelConfidence] ?? CONF_CONFIG.High;

    return (
        <div className="bg-white dark:bg-darkBackground border border-gray-100 dark:border-gray-700/50 rounded-xl p-5 shadow-sm space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:traffic-light" className="w-5 h-5 text-violet-500" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Traffic Scenarios</h3>
                    {isSimulating && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Active
                        </span>
                    )}
                </div>
                {spikeActive && (
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        {activeScenario?.label}
                    </div>
                )}
            </div>

            {/* Server unavailable warning — visible when local Express server is down */}
            {isSimulating && !candidatesReady && (
                <div className="flex gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-xs text-amber-700 dark:text-amber-300">
                    <Icon icon="mdi:server-off" className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                        Local server offline — using queue-based scenario selection (reduced accuracy).
                        Run <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">node server/index.js</code> for pre-validated full-dataset scenarios.
                    </span>
                </div>
            )}

            {/* OOD Confidence meter — always visible once simulation starts */}
            {isSimulating && (
                <div className={`rounded-xl border px-4 py-3 ${confCfg.bg} ${spikeActive ? "border-current" : "border-transparent"}`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Icon icon={confCfg.icon} className={`w-5 h-5 ${confCfg.color}`} />
                            <span className={`text-sm font-semibold ${confCfg.color}`}>Model Confidence: {modelConfidence}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${confCfg.color}`}>{oodScore}% OOD</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${confCfg.bar}`}
                            style={{ width: `${oodScore}%` }}
                        />
                    </div>
                    <p className={`text-xs mt-1.5 ${confCfg.color} opacity-80`}>
                        {oodScore < 20
                            ? "All features within expected range — inference running at full confidence."
                            : oodScore < 50
                            ? "Minor feature drift detected — confidence marginally reduced."
                            : oodScore < 75
                            ? "Significant deviation from operational baseline — scaling predictions may be conservative."
                            : "Extreme input deviation detected — predictions degraded. Expected behaviour under severe traffic anomalies."}
                    </p>
                </div>
            )}

            {/* Active scenario insight callout */}
            {activeScenario && (
                <div className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <Icon icon="mdi:lightbulb-on" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-0.5">
                            Inference behaviour · <span className={activeScenario.color}>{activeScenario.label}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{activeScenario.modelExpect}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Monitor the <span className="font-semibold">pod forecast chart</span> and <span className="font-semibold">MAE</span> in the accuracy panel to observe the model’s response.
                        </p>
                    </div>
                </div>
            )}

            {/* Scenario cards */}
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {SCENARIOS.map((s) => {
                        const isActive = spikeActive === s.type;
                        return (
                            <button
                                key={s.type}
                                onClick={() => canInject && !spikeActive && injectSpike(s.type)}
                                disabled={!canInject || !!spikeActive}
                                className={`relative text-left p-4 rounded-xl border transition-all duration-200 ${
                                    isActive
                                        ? `${s.bg} ${s.border} ring-2 ring-offset-1 ring-current`
                                        : canInject && !spikeActive
                                        ? `${s.bg} ${s.border} hover:brightness-95 cursor-pointer`
                                        : "bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                                }`}
                            >
                                {isActive && <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${s.activeBg} animate-ping`} />}
                                <Icon icon={s.icon} className={`w-6 h-6 mb-2 ${isActive ? s.color : "text-gray-400"}`} />
                                <p className={`text-sm font-semibold mb-1 ${isActive ? s.color : "text-gray-700 dark:text-gray-200"}`}>{s.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mb-2">{s.description}</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${ACCURACY_BADGE[s.expectedAccuracy]}`}>
                                        {s.expectedAccuracy} accuracy
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-mono">{s.oodExpected} OOD</span>
                                    {isSimulating && (
                                        candidatesReady
                                            ? <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                                ✓ Pre-validated
                                              </span>
                                            : <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                                Queue fallback
                                              </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:information-outline" className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                <span>
                    Scenarios are sourced from production traffic history. The inference engine processes real feature distributions, ensuring scaling decisions reflect observed production behavior.
                </span>
            </div>

            {!isSimulating && (
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <Icon icon="mdi:timer-sand" className="w-4 h-4" />
                    Initializing data stream…
                </p>
            )}
            {apiPending && (
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <Icon icon="mdi:cloud-sync-outline" className="w-4 h-4 animate-spin" />
                    Connecting to inference engine…
                </p>
            )}
        </div>
    );
};

export default TrafficSpikePanel;
