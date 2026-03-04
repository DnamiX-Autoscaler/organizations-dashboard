import React from "react";
import TitleHeader from "../../../components/common/TitleHeader";
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
                subtitle="Detailed per-prediction log, accuracy trends, and error analysis"
            />

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
