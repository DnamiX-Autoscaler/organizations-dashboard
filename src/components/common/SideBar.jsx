import React from "react";
import SideBarOne from "./side_bar/SideBarOne";
import SideBarTwo from "./side_bar/SideBarTwo";
import { useRoute } from "../../utils/RouteContext";
import { alertsData } from "../../data";

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
    { id: "processes", label: "Processes", hasNotification: false },
    { id: "performance", label: "Performance", hasNotification: false },
    { id: "level-usages", label: "Level Usages", hasNotification: false },
    { id: "graph-centrality", label: "Graph Centrality", hasNotification: false },
    { id: "indexes", label: "Indexes", hasNotification: false },
    { id: "configurations", label: "Configurations", hasNotification: false },
    { id: "explore", label: "Explore", hasNotification: false },
    { id: "running-pods", label: "Running Pods", hasNotification: false },
    { id: "services", label: "Services", hasNotification: false },
    { id: "prometheus-ips", label: "Prometheus IPs", hasNotification: false },
    { id: "monitoring-notes", label: "Monitoring Notes", hasNotification: false },
    { id: "data-exporter", label: "Data Exporter", hasNotification: false },
  ],
  mlmodel: [
    { id: "ml-ops-overview", label: "Overview", hasNotification: false },
    { id: "prediction-lab", label: "Prediction Lab", hasNotification: false },
    { id: "cost-savings", label: "Cost Savings", hasNotification: false },
    { id: "resource-monitor", label: "Resource Monitor", hasNotification: false },
    { id: "ml-alerts", label: "Alerts", hasNotification: true },
    { id: "logs", label: "System Logs", hasNotification: false },
  ],
  scaling: [
    { id: "event", label: "Scaling Event", hasNotification: false },
    { id: "metrics", label: "Resilience Metrics", hasNotification: false },
    { id: "chaos-analysis", label: "Chaos Analysis", hasNotification: false },
    { id: "real-time-scaling", label: "Real-Time Scaling", hasNotification: false },
    { id: "health", label: "Deployment Health", hasNotification: false },
    { id: "alerts", label: "Alerts", hasNotification: true },
    { id: "config", label: "Threshold Policy Config", hasNotification: false },
    { id: "reports", label: "Reports and Exports", hasNotification: false },
    { id: "cost", label: "Cost & Resource Impact", hasNotification: false },
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
  const { activeMain, activeSub, setActiveMain, setActiveSub } = useRoute();

  const unreadAlerts = alertsData.filter((a) => a.status !== "resolved").length;
  const dynamicScalingMenu = SUB_MENUS.scaling.map((item) =>
    item.id === "alerts"
      ? { ...item, count: unreadAlerts, hasNotification: unreadAlerts > 0 }
      : item
  );
  const currentSubMenu =
    activeMain === "scaling" ? dynamicScalingMenu : SUB_MENUS[activeMain];

  const handleMainChange = (id) => {
    setActiveMain(id);
    setActiveSub(SUB_MENUS[id][0]?.id);

    // Auto-expand sidebar when a main menu item is clicked while collapsed
    if (isCollapsed) {
      onToggle();
    }
  };

  const handleSubChange = (subId) => {
    setActiveSub(subId);
  };

  return (
    <div className="relative flex">
      {/* Primary Sidebar - Higher z-index to ensure tooltips show above secondary sidebar */}
      <div className="relative z-[100]">
        <SideBarOne
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          activeItem={activeMain}
          unreadScalingCount={unreadAlerts}
          onActiveChange={handleMainChange}
        />
      </div>

      {/* Secondary Sidebar with smooth transition - Lower z-index */}
      <div
        className={`transition-all duration-300 overflow-hidden relative z-[50] bg-backgroundLight dark:bg-darkBackground border-r border-gray-200 dark:border-darkBackgroundVery ${isCollapsed ? "w-0" : "w-64"
          }`}
      >
        {!isCollapsed && (
          <SideBarTwo
            title={MAIN_MENU_LABELS[activeMain]}
            subMenuItems={currentSubMenu}
            activeSubItem={activeSub}
            onSubChange={handleSubChange}
          />
        )}
      </div>
    </div>
  );
};

export default SideBar;
