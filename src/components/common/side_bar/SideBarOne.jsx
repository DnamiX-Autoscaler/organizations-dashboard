import React, { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const SideBarOne = ({ isCollapsed, onToggle, activeItem, onActiveChange }) => {
  const menuContainerRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const menuItems = [
    {
      id: "overview",
      icon: <Icon icon="mdi:chart-pie" className="w-6 h-6" />,
      label: "Overview",
      description: "System Dashboard & Analytics",
    },
    {
      id: "projects",
      icon: <Icon icon="mdi:folder-outline" className="w-6 h-6" />,
      label: "Projects",
      description: "Project Management Hub",
    },
    {
      id: "metrics",
      icon: <Icon icon="mdi:chart-bar" className="w-6 h-6" />,
      label: "Metrics",
      description: "Performance Monitoring",
    },
    {
      id: "mlmodel",
      icon: <Icon icon="mdi:robot-outline" className="w-6 h-6" />,
      label: "ML Model",
      description: "Machine Learning Operations",
    },
    {
      id: "scaling",
      icon: <Icon icon="mdi:arrow-expand-vertical" className="w-6 h-6" />,
      label: "Scaling",
      description: "Infrastructure Auto-scaling",
    },
    {
      id: "reciliance",
      icon: <Icon icon="mdi:shield-refresh-outline" className="w-6 h-6" />,
      label: "Resilience",
      description: "System Reliability & Recovery",
    },
    {
      id: "security",
      icon: <Icon icon="mdi:shield-outline" className="w-6 h-6" />,
      label: "Security",
      description: "Access Control & Protection",
    },
    {
      id: "deployments",
      icon: <Icon icon="mdi:cloud-upload-outline" className="w-6 h-6" />,
      label: "Deployments",
      description: "Application Deployment Center",
    },
    {
      id: "api-checker",
      icon: <Icon icon="mdi:api" className="w-6 h-6" />,
      label: "API Checker",
      description: "API Health Monitoring",
    },
    {
      id: "terminal",
      icon: <Icon icon="mdi:console" className="w-6 h-6" />,
      label: "Terminal",
      description: "Cloud Terminal Access",
    },
    {
      id: "cost-analyzer",
      icon: <Icon icon="mdi:currency-usd" className="w-6 h-6" />,
      label: "Cost Analyzer",
      description: "Resource Cost Optimization",
    },
    {
      id: "dnamix-ai",
      icon: <Icon icon="mdi:brain" className="w-6 h-6" />,
      label: "DnamiX AI",
      description: "AI-Powered Insights & Automation",
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
      label: "User Profile",
      description: "Account Settings & Preferences",
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
      label: "System Settings",
      description: "Platform Configuration",
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
      description: "Sign Out Securely",
    },
  ];

  // Auto-scroll to active item when it changes
  useEffect(() => {
    if (menuContainerRef.current && activeItem) {
      const activeButton = menuContainerRef.current.querySelector(
        `[data-menu-id="${activeItem}"]`
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeItem]);

  // Handle mouse wheel scrolling
  const handleWheel = (e) => {
    if (menuContainerRef.current) {
      e.preventDefault();
      const container = menuContainerRef.current;
      const scrollAmount = e.deltaY * 0.5; // Smooth scroll multiplier

      container.scrollTo({
        top: container.scrollTop + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle mouse enter for tooltip
  const handleMouseEnter = (itemId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 12, // 12px gap from the button
    });
    setHoveredItem(itemId);
  };

  // Handle mouse leave for tooltip
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // Get current hovered item data
  const hoveredItemData = hoveredItem
    ? [...menuItems, ...bottomItems].find(item => item.id === hoveredItem)
    : null;

  return (
    <>
      <div
        className={`flex flex-col justify-between bg-white border-r border-gray-200 transition-all duration-300 relative z-[100] ${isCollapsed ? "w-16" : "w-16"
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

        {/* Main Menu Items with custom scrollbar */}
        <div
          ref={menuContainerRef}
          className="flex flex-col flex-1 px-2 space-y-1 overflow-y-auto scrollbar-hide"
          onWheel={handleWheel}
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                data-menu-id={item.id}
                onClick={() => onActiveChange(item.id)}
                onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                onMouseLeave={handleMouseLeave}
                className={`p-3 rounded-lg transition-colors w-full flex items-center justify-center ${activeItem === item.id
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Menu Items */}
        <div className="flex flex-col px-2 pb-4 space-y-1">
          {bottomItems.map((item) => (
            <div key={item.id}>
              <button
                className="flex items-center justify-center w-full p-3 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-50"
                onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                onMouseLeave={handleMouseLeave}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Global Tooltip Portal - Only shows when hovering */}
      {hoveredItem && hoveredItemData && (
        <div
          className="fixed pointer-events-none z-[10000] transition-all duration-200 ease-in-out"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateY(-50%)',
            opacity: hoveredItem ? 1 : 0,
          }}
        >
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700 min-w-[200px] max-w-[250px]">
            <div className="mb-1 text-sm font-semibold text-white">
              {hoveredItemData.label}
            </div>
            <div className="text-xs leading-relaxed text-gray-300">
              {hoveredItemData.description}
            </div>
            {/* Arrow pointing to the button */}
            <div className="absolute transform -translate-y-1/2 right-full top-1/2">
              <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBarOne;