import React from "react";
import TitleHeader from "../../../components/common/TitleHeader";
import TrafficSpikePanel from "../../../components/mlmodel/TrafficSpikePanel";
import PredictionAccuracyChart from "../../../components/mlmodel/PredictionAccuracyChart";
import PredictionLogTable from "../../../components/mlmodel/PredictionLogTable";
import ModelMetrics from "../../../components/mlmodel/ModelMetrics";
import AccuracyTrendChart from "../../../components/mlmodel/AccuracyTrendChart";
import useMLModel from "../../../services/useMLModel";

const MLModelPredictionLab = () => {
    const { predictionLog, modelMetrics, accuracyHistory } = useMLModel();

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Prediction Lab"
                subtitle="Traffic scenario analysis · Forecast evaluation · Accuracy benchmarking"
            />

            {/* Traffic scenario engine — inject load patterns to evaluate model response */}
            <TrafficSpikePanel />

            {/* Forecast accuracy — predicted vs actual at the same T+5 moment */}
            <PredictionAccuracyChart />

            {/* Model metrics summary */}
            <ModelMetrics metrics={modelMetrics} />

            {/* Accuracy trend */}
            <AccuracyTrendChart accuracyHistory={accuracyHistory} />

            {/* Full log table */}
            <PredictionLogTable logs={predictionLog} />
        </div>
    );
};

export default MLModelPredictionLab;
