import React from "react";

const SideBarTwo = ({ title, subMenuItems, activeSubItem, onSubChange }) => {
  return (
    <div className="flex flex-col w-64 border-r border-gray-200 bg-backgroundLight relative z-[50]">

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-800 text-md">{title}</h2>
        {/* Optionally, you can customize the subtitle based on title if needed */}
        {/* <p className="mt-1 text-sm text-gray-500">
          {title === "Metrics" ? "Monitor your system performance" : ""}
        </p> */}
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search metrics..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md pl-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
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
              onClick={() => onSubChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${activeSubItem === item.id
                ? "bg-primary text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              <span>{item.label}</span>
              {item.hasNotification && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
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
              <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarTwo;