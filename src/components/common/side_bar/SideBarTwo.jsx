import React, { useState } from "react";

const SideBarTwo = () => {
  const [activeSubItem, setActiveSubItem] = useState("overview");

  const subMenuItems = [
    { id: "overview", label: "Overview", hasNotification: false },
    { id: "analytics", label: "Analytics", hasNotification: false },
    { id: "reports", label: "Reports", hasNotification: true },
    { id: "notifications", label: "Notifications", hasNotification: false },
    { id: "alerts", label: "Alerts", hasNotification: false },
    { id: "logs", label: "Logs", hasNotification: false },
    { id: "performance", label: "Performance", hasNotification: false },
    { id: "usage", label: "Usage", hasNotification: false },
    { id: "cost", label: "Cost Analysis", hasNotification: false },
    { id: "trends", label: "Trends", hasNotification: false },
    { id: "forecasting", label: "Forecasting", hasNotification: false },
  ];

  return (
    <div className="bg-backgroundLight border-r border-gray-200 w-64 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Metrics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your system performance
        </p>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search metrics..."
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 pb-4">
        <nav className="space-y-1">
          {subMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubItem(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                activeSubItem === item.id
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span>{item.label}</span>
              {item.hasNotification && (
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="flex items-center justify-between mb-1">
            <span>Last updated:</span>
            <span>2 min ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarTwo;
