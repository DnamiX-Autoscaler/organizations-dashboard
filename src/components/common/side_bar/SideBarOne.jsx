import React, { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const SideBarOne = ({ isCollapsed, onToggle, activeItem, onActiveChange, unreadScalingCount = 0 }) => {
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
      icon: <Icon icon="tabler:folders" className="w-6 h-6" />,
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
      icon: <Icon icon="carbon:model-alt" className="w-6 h-6" />,
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
      icon: <Icon icon="mdi:security-lock-outline" className="w-6 h-6" />,
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
      icon: <Icon icon="fluent:money-24-regular" className="w-6 h-6" />,
      label: "Cost Analyzer",
      description: "Resource Cost Optimization",
    },
    {
      id: "dnamix-ai",
      icon: <Icon icon="hugeicons:ai-magic" className="w-6 h-6" />,
      label: "DnamiX AI",
      description: "AI-Powered Insights & Automation",
    },
  ];

  const bottomItems = [
    {
      id: "profile",
      icon: (
        // <img
        //   src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
        //   alt="User Profile"
        //   className="object-cover border-2 border-gray-200 rounded-full w-7 h-7"
        // />
        <Icon icon="solar:user-linear" className="w-6 h-6" />
      ),
      label: "User Profile",
      description: "Account Settings & Preferences",
    },
    {
      id: "settings",
      icon: <Icon icon="mdi:cog-outline" className="w-6 h-6" />,
      label: "System Settings",
      description: "Platform Configuration",
    },
    {
      id: "logout",
      icon: <Icon icon="mdi:logout" className="w-6 h-6" />,
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
    ? [...menuItems, ...bottomItems].find((item) => item.id === hoveredItem)
    : null;

  return (
    <>
      <div
        className={`flex flex-col bg-white dark:bg-darkBackground border-r border-gray-200 dark:border-darkBackgroundVery transition-all duration-300 relative z-[100] ${
          isCollapsed ? "w-16" : "w-16"
        } h-screen`}
      >
        {/* Toggle Button */}
        <div className="flex-shrink-0 p-4">
          <button
            onClick={onToggle}
            className={`flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 ${
              isCollapsed ? "rotate-0" : "rotate-180"
            }`}
          >
            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
          </button>
        </div>

        {/* Main Menu Items with custom scrollbar */}
        <div className="flex flex-col flex-1 min-h-0">
          <div
            ref={menuContainerRef}
            className="flex flex-col flex-1 min-h-0 px-2 space-y-1 overflow-y-auto scrollbar-hide"
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
                  className={`p-3 rounded-lg transition-colors w-full flex items-center justify-center relative ${
                    activeItem === item.id
                      ? "text-primary dark:text-primary"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-black"
                  }`}
                >
                  {item.icon}
                  {item.id === "scaling" && unreadScalingCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] px-1.5 h-5 text-[11px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                      {unreadScalingCount}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Menu Items */}
        <div className="flex flex-col flex-shrink-0 px-2 pb-4 space-y-1">
          {bottomItems.map((item) => (
            <div key={item.id}>
              <button
                className="flex items-center justify-center w-full p-3 text-gray-400 transition-colors rounded-lg dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-black"
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
            transform: "translateY(-50%)",
            opacity: hoveredItem ? 1 : 0,
          }}
        >
          <div className="px-4 py-3 rounded-lg shadow-2xl dark:border-gray-700 min-w-[200px] max-w-[250px] bg-white/70 dark:bg-darkBackgroundVery/70 backdrop-blur-md">
            <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              {hoveredItemData.label}
            </div>
            <div className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              {hoveredItemData.description}
            </div>
            {/* Arrow pointing to the button */}
            <div className="absolute transform -translate-y-1/2 right-full top-1/2">
              <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-transparent border-r-white/70 dark:border-r-gray-900/70"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBarOne;
