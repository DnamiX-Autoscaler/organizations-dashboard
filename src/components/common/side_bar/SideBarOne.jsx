import React from "react";
import { Icon } from "@iconify/react";

const SideBarOne = ({ isCollapsed, onToggle, activeItem, onActiveChange }) => {
  const menuItems = [
    {
      id: "overview",
      icon: <Icon icon="mdi:chart-pie" className="w-6 h-6" />,
      label: "Overview",
    },
    {
      id: "projects",
      icon: <Icon icon="mdi:folder-outline" className="w-6 h-6" />,
      label: "Projects",
    },
    {
      id: "metrics",
      icon: <Icon icon="mdi:chart-bar" className="w-6 h-6" />,
      label: "Metrics",
    },
    {
      id: "mlmodel",
      icon: <Icon icon="mdi:robot-outline" className="w-6 h-6" />,
      label: "ML Model",
    },
    {
      id: "scaling",
      icon: <Icon icon="mdi:arrow-expand-vertical" className="w-6 h-6" />,
      label: "Scaling",
    },
    {
      id: "reciliance",
      icon: <Icon icon="mdi:shield-refresh-outline" className="w-6 h-6" />,
      label: "Reciliance",
    },
    {
      id: "security",
      icon: <Icon icon="mdi:shield-outline" className="w-6 h-6" />,
      label: "Security",
    },
    {
      id: "deployments",
      icon: <Icon icon="mdi:cloud-upload-outline" className="w-6 h-6" />,
      label: "Deployments",
    },
    {
      id: "api-checker",
      icon: <Icon icon="mdi:api" className="w-6 h-6" />,
      label: "API Checker",
    },
    {
      id: "terminal",
      icon: <Icon icon="mdi:console" className="w-6 h-6" />,
      label: "Terminal",
    },
    {
      id: "cost-analyzer",
      icon: <Icon icon="mdi:currency-usd" className="w-6 h-6" />,
      label: "Cost Analyzer",
    },
    {
      id: "dnami-ai",
      icon: <Icon icon="mdi:brain" className="w-6 h-6" />,
      label: "Dnami AI",
    },
  ];

  const bottomItems = [
    {
      id: "profile",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Profile",
    },
    {
      id: "settings",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: "Settings",
    },
    {
      id: "logout",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
      label: "Logout",
    },
  ];

  return (
    <div
      className={`flex flex-col justify-between bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-16"
        }`}
    >
      {/* Toggle Button */}
      <div className="p-4">
        <button
          onClick={onToggle}
          className={`flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"
            }`}
        >
          <Icon icon="mdi:chevron-left" className="w-5 h-5" />
        </button>
      </div>

      {/* Main Menu Items */}
      <div className="flex flex-col flex-1 px-2 space-y-1 overflow-hidden">
        {menuItems.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={() => onActiveChange(item.id)}
              className={`p-3 rounded-lg transition-colors w-full flex items-center justify-center ${activeItem === item.id
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
            >
              {item.icon}
            </button>

            {/* Tooltip on hover when collapsed */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Menu Items */}
      <div className="flex flex-col px-2 pb-4 space-y-1">
        {bottomItems.map((item) => (
          <div key={item.id} className="relative group">
            <button
              className="p-3 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-50 w-full flex items-center justify-center"
            >
              {item.icon}
            </button>

            {/* Tooltip on hover when collapsed */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarOne;
