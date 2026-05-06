import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TitleHeader from "../../../components/common/TitleHeader";
import ExploreGraph from "../../../components/metrics/explore/ExploreGraph";

const Explore = () => {
  const [queries, setQueries] = useState([
    {
      id: 1,
      query: "",
      isExecuted: false,
      result: null,
      loading: false,
      error: null,
    },
  ]);
  const [activeQueryId, setActiveQueryId] = useState(1);

  // Example queries for quick access
  const exampleQueries = [
    "prometheus_http_requests_total",
    "up",
    "node_cpu_seconds_total",
    "process_cpu_seconds_total",
    "http_requests_total",
  ];

  const addNewQuery = () => {
    const newQuery = {
      id: Date.now(),
      query: "",
      isExecuted: false,
      result: null,
      loading: false,
      error: null,
    };
    setQueries([...queries, newQuery]);
    setActiveQueryId(newQuery.id);
  };

  const removeQuery = (id) => {
    if (queries.length === 1) return;
    const newQueries = queries.filter((q) => q.id !== id);
    setQueries(newQueries);
    if (activeQueryId === id) {
      setActiveQueryId(newQueries[0].id);
    }
  };

  const updateQuery = (id, newQuery) => {
    setQueries(
      queries.map((q) => (q.id === id ? { ...q, query: newQuery } : q))
    );
  };

  const executeQuery = async (id) => {
    const query = queries.find((q) => q.id === id);
    if (!query || !query.query.trim()) return;

    // Update loading state
    setQueries(
      queries.map((q) =>
        q.id === id ? { ...q, loading: true, error: null } : q
      )
    );

    try {
      const { executePrometheusQuery } = await import(
        "../../../data/rawMetrics"
      );
      const result = await executePrometheusQuery(query.query);

      setQueries(
        queries.map((q) =>
          q.id === id
            ? {
                ...q,
                isExecuted: true,
                result,
                loading: false,
                error: null,
              }
            : q
        )
      );
    } catch (error) {
      setQueries(
        queries.map((q) =>
          q.id === id
            ? {
                ...q,
                loading: false,
                error: error.message || "Failed to execute query",
              }
            : q
        )
      );
    }
  };

  const activeQuery = queries.find((q) => q.id === activeQueryId);

  return (
    <div className="space-y-6">
      <TitleHeader
        title="Prometheus Explorer"
        subtitle="Execute PromQL queries and visualize metrics data"
      />

      {/* Query Input Section */}
      <div className="space-y-4">
        {/* Query Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {queries.map((query) => (
            <div
              key={query.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                activeQueryId === query.id
                  ? "bg-primary/10 border-primary text-primary dark:bg-primary/20"
                  : "bg-white dark:bg-darkBackground border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50"
              }`}
              onClick={() => setActiveQueryId(query.id)}
            >
              <Icon icon="mdi:code-braces" className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">
                Query {queries.findIndex((q) => q.id === query.id) + 1}
              </span>
              {query.isExecuted && (
                <Icon
                  icon="mdi:check-circle"
                  className="w-4 h-4 text-primary"
                />
              )}
              {queries.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuery(query.id);
                  }}
                  className="ml-1 transition-colors hover:text-red-500"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewQuery}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border border-dashed rounded-lg text-primary border-primary hover:bg-primary/5"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Add Query
          </button>
        </div>

        {/* Active Query Input */}
        {activeQuery && (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkBackgroundVery">
              <Icon icon="mdi:code-tags" className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                PromQL Expression
              </span>
            </div>

            <div className="p-4">
              <div className="relative">
                <textarea
                  value={activeQuery.query}
                  onChange={(e) => updateQuery(activeQueryId, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                      executeQuery(activeQueryId);
                    }
                  }}
                  placeholder="Enter PromQL query (e.g., prometheus_http_requests_total)"
                  className="w-full px-4 py-3 font-mono text-sm text-gray-900 border border-gray-200 rounded-lg resize-none bg-gray-50 dark:bg-darkBackgroundVery dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Icon icon="mdi:information-outline" className="w-4 h-4" />
                    <span>Press Ctrl + Enter to execute</span>
                  </div>
                  <button
                    onClick={() => executeQuery(activeQueryId)}
                    disabled={!activeQuery.query.trim() || activeQuery.loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeQuery.loading ? (
                      <>
                        <Icon
                          icon="mdi:loading"
                          className="w-4 h-4 animate-spin"
                        />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:play" className="w-4 h-4" />
                        Execute Query
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {activeQuery.error && (
                <div className="flex items-start gap-3 p-4 mt-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                      Query Execution Failed
                    </p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                      {activeQuery.error}
                    </p>
                  </div>
                </div>
              )}

              {/* Example Queries */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  Example Queries:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example) => (
                    <button
                      key={example}
                      onClick={() => updateQuery(activeQueryId, example)}
                      className="px-3 py-1.5 text-xs font-mono bg-gray-100 dark:bg-darkBackgroundVery text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {activeQuery?.isExecuted && activeQuery.result && (
        <ExploreGraph
          queryData={activeQuery.result}
          queryExpression={activeQuery.query}
        />
      )}

      {/* No Results Placeholder */}
      {!activeQuery?.isExecuted && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
          <Icon
            icon="mdi:chart-line"
            className="w-16 h-16 text-gray-300 dark:text-gray-600"
          />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
            No query executed yet
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Enter a PromQL query and click "Execute Query" to see results
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
