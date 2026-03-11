import React from "react";
import TitleHeader from "../../../components/common/TitleHeader";
import ResourceMetrics from "../../../components/mlmodel/ResourceMetrics";
import PerformanceMetrics from "../../../components/mlmodel/PerformanceMetrics";
import FeatureMonitor from "../../../components/mlmodel/FeatureMonitor";
import useMLModel from "../../../services/useMLModel";

const MLModelResourceMonitor = () => {
    const { resourceData, performanceData, currentFeatures, featureHistory } = useMLModel();

    return (
        <div className="space-y-6">
            <TitleHeader
                title="Resource Monitor"
                subtitle="Live CPU, memory, network, performance metrics, and raw model input features"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResourceMetrics data={resourceData} />
                <PerformanceMetrics data={performanceData} />
            </div>

            <FeatureMonitor currentFeatures={currentFeatures} featureHistory={featureHistory} />
        </div>
    );
};

export default MLModelResourceMonitor;
