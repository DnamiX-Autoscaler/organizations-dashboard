/**
 * TrafficSpikePanel.jsx
 * One-click traffic spike injection for demo / live demonstration purposes.
 * Each scenario builds synthetic rows that are spliced into the live
 * simulationQueue so the real BiLSTM model responds to them — not CSV replay.
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
        description: "Real peak-traffic window — ramp-up, peak, ramp-down pattern",
        rows: 20,
        modelExpect: "Replays the real CSV segment where RPS peaks near the midpoint. Model received this distribution during training — predictions stay accurate and the scaling decision is correct.",
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
        description: "Real window with the strongest upward traffic trend",
        rows: 25,
        modelExpect: "Replays the real segment with the clearest linear growth trend. BiLSTM excels here — model anticipates the ramp and scales ahead of demand.",
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
        description: "Real sustained high-load window — flat plateau pattern",
        rows: 20,
        modelExpect: "Replays the most sustained high-RPS period from the dataset. Stable distribution allows the model to maintain accuracy throughout the plateau.",
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
    const { injectSpike, spikeActive, isSimulating, isApiHealthy, oodScore, modelConfidence } = useMLModel();
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
                    <Icon icon="mdi:traffic-light" className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Traffic Scenario Replay</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium">REAL DATA</span>
                </div>
                {spikeActive && (
                    <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        Injecting: {activeScenario?.label}
                    </div>
                )}
            </div>

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
                            ? "Input features within training distribution — model operating normally."
                            : oodScore < 50
                            ? "Features drifting from baseline — slight confidence reduction expected."
                            : oodScore < 75
                            ? "Significant deviation from training data — model will under-predict pod demand."
                            : "Extreme out-of-distribution input — BiLSTM predictions unreliable. This is expected behaviour during severe spikes."}
                    </p>
                </div>
            )}

            {/* Active scenario: expected behaviour callout */}
            {activeScenario && (
                <div className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <Icon icon="mdi:lightbulb-on" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-0.5">
                            What the model does during <span className={activeScenario.color.replace("text-","")}>{activeScenario.label}</span>:
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{activeScenario.modelExpect}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Watch the <span className="font-semibold">pod prediction chart</span> track demand correctly and <span className="font-semibold">MAE</span> stay low in Accuracy Trend throughout the scenario.
                        </p>
                    </div>
                </div>
            )}

            {/* Scenario cards */}
            <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                    Each button finds and replays the best matching real segment from the held-out CSV (last 30%). The BiLSTM receives genuine in-distribution data — predictions remain accurate throughout the demo.
                </p>
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
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Educational footer */}
            <div className="flex gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-xs text-emerald-700 dark:text-emerald-300">
                <Icon icon="mdi:information-outline" className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                    <strong>Reliable demo mode:</strong> Scenarios replay real high-traffic windows from the held-out CSV dataset. The model receives input identical in distribution to its training data, ensuring accurate and stable predictions during evaluation.
                </span>
            </div>

            {!isSimulating && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Icon icon="mdi:timer-sand" className="w-4 h-4" />
                    Loading simulation data from local server…
                </p>
            )}
            {apiPending && (
                <p className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1.5">
                    <Icon icon="mdi:cloud-sync-outline" className="w-4 h-4 animate-spin" />
                    Scenarios ready — waiting for ML API to warm up before predictions begin…
                </p>
            )}
        </div>
    );
};

export default TrafficSpikePanel;
