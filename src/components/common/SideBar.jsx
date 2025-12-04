import React, { useState } from "react";
import SideBarOne from "./side_bar/SideBarOne";
import SideBarTwo from "./side_bar/SideBarTwo";

// Define sub-menu items for each main menu id
const SUB_MENUS = {
  overview: [
    { id: "summary", label: "Summary", hasNotification: false },
    { id: "activity", label: "Activity", hasNotification: false },
  ],
  projects: [
    { id: "all-projects", label: "All Projects", hasNotification: false },
    { id: "new-project", label: "New Project", hasNotification: false },
  ],
  metrics: [
    { id: "performance", label: "Performance", hasNotification: false },
    { id: "usage", label: "Usage", hasNotification: false },
    { id: "trends", label: "Trends", hasNotification: false },
    { id: "forecasting", label: "Forecasting", hasNotification: false },
  ],
  mlmodel: [
    { id: "models", label: "Models", hasNotification: false },
    { id: "training", label: "Training", hasNotification: false },
    { id: "deployments", label: "Deployments", hasNotification: false },
  ],
  scaling: [
    { id: "auto", label: "Auto Scaling", hasNotification: false },
    { id: "manual", label: "Manual Scaling", hasNotification: false },
  ],
  reciliance: [
    { id: "uptime", label: "Uptime", hasNotification: false },
    { id: "failover", label: "Failover", hasNotification: false },
  ],
  security: [
    { id: "users", label: "Users", hasNotification: false },
    { id: "roles", label: "Roles", hasNotification: false },
    { id: "audit", label: "Audit Logs", hasNotification: false },
  ],
  deployments: [
    { id: "active", label: "Active Deployments", hasNotification: false },
    { id: "history", label: "Deployment History", hasNotification: false },
  ],
  "api-checker": [
    { id: "endpoints", label: "Endpoints", hasNotification: false },
    { id: "monitor", label: "Monitor", hasNotification: false },
  ],
  terminal: [
    { id: "access", label: "Access", hasNotification: false },
    { id: "logs", label: "Logs", hasNotification: false },
  ],
  "cost-analyzer": [
    { id: "overview", label: "Overview", hasNotification: false },
    { id: "details", label: "Details", hasNotification: false },
  ],
  "dnamix-ai": [
    { id: "insights", label: "Insights", hasNotification: false },
    { id: "assist", label: "Assist", hasNotification: false },
  ],
};

const MAIN_MENU_IDS = Object.keys(SUB_MENUS);

const MAIN_MENU_LABELS = {
  overview: "Overview",
  projects: "Projects",
  metrics: "Metrics",
  mlmodel: "ML Model",
  scaling: "Scaling",
  reciliance: "Reciliance",
  security: "Security",
  deployments: "Deployments",
  "api-checker": "API Checker",
  terminal: "Terminal",
  "cost-analyzer": "Cost Analyzer",
  "dnamix-ai": "DnamiX AI",
};

const SideBar = ({ isCollapsed, onToggle }) => {
  const [activeMain, setActiveMain] = useState(MAIN_MENU_IDS[0]);
  const [activeSub, setActiveSub] = useState(SUB_MENUS[activeMain][0]?.id);

  const handleMainChange = (id) => {
    setActiveMain(id);
    setActiveSub(SUB_MENUS[id][0]?.id);

    // Auto-expand sidebar when a main menu item is clicked while collapsed
    if (isCollapsed) {
      onToggle();
    }
  };

  return (
    <div className="relative flex">
      {/* Primary Sidebar - Higher z-index to ensure tooltips show above secondary sidebar */}
      <div className="relative z-[100]">
        <SideBarOne
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          activeItem={activeMain}
          onActiveChange={handleMainChange}
        />
      </div>

      {/* Secondary Sidebar with smooth transition - Lower z-index */}
      <div className={`transition-all duration-300 overflow-hidden relative z-[50] bg-backgroundLight dark:bg-darkBackground border-r border-gray-200 dark:border-darkBackgroundVery ${isCollapsed ? "w-0" : "w-64"
        }`}>
        {!isCollapsed && (
          <SideBarTwo
            title={MAIN_MENU_LABELS[activeMain]}
            subMenuItems={SUB_MENUS[activeMain]}
            activeSubItem={activeSub}
            onSubChange={setActiveSub}
          />
        )}
      </div>
    </div>
  );
};

export default SideBar;