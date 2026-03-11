import React, { useState } from "react";

const models = [
  "Random Forest",
  "Isolation Forest",
  "SVM",
  "Logistic Regression",
  "KNN",
];

const ModelEvaluation = () => {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const metrics = {
    accuracy: "96%",
    precision: "94%",
    recall: "93%",
  };

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Model Evaluation Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Compare performance of trained anomaly detection models
        </p>
      </div>

      {/* Select Model */}
      <div className="bg-white dark:bg-darkBackground rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Select Model
        </h2>

        <div className="flex flex-wrap gap-3">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`px-4 py-2 rounded-md border text-sm transition
              ${
                selectedModel === model
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 dark:bg-black text-gray-700 dark:text-gray-300 border-gray-200"
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Accuracy */}
        <div className="bg-white dark:bg-darkBackground rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Accuracy</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {metrics.accuracy}
          </p>
        </div>

        {/* Precision */}
        <div className="bg-white dark:bg-darkBackground rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Precision</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {metrics.precision}
          </p>
        </div>

        {/* Recall */}
        <div className="bg-white dark:bg-darkBackground rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Recall</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {metrics.recall}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ModelEvaluation;