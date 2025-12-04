import React, { useState } from "react";
import SideBarOne from "./side_bar/SideBarOne";
import SideBarTwo from "./side_bar/SideBarTwo";

// Define sub-menu items for each main menu id
const SUB_MENUS = {
  metrics: [
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
  ],
  dashboard: [
    { id: "main", label: "Main", hasNotification: false },
    { id: "widgets", label: "Widgets", hasNotification: false },
  ],
  applications: [
    { id: "list", label: "App List", hasNotification: false },
    { id: "deploy", label: "Deploy", hasNotification: false },
  ],
  services: [
    { id: "list", label: "Service List", hasNotification: false },
    { id: "add", label: "Add Service", hasNotification: false },
  ],
  infrastructure: [
    { id: "servers", label: "Servers", hasNotification: false },
    { id: "clusters", label: "Clusters", hasNotification: false },
  ],
  database: [
    { id: "instances", label: "Instances", hasNotification: false },
    { id: "backups", label: "Backups", hasNotification: false },
  ],
  security: [
    { id: "users", label: "Users", hasNotification: false },
    { id: "roles", label: "Roles", hasNotification: false },
  ],
  monitoring: [
    { id: "status", label: "Status", hasNotification: false },
    { id: "uptime", label: "Uptime", hasNotification: false },
  ],
  api: [
    { id: "endpoints", label: "Endpoints", hasNotification: false },
    { id: "keys", label: "API Keys", hasNotification: false },
  ],
};

const MAIN_MENU_IDS = Object.keys(SUB_MENUS);

const SideBar = ({ isCollapsed, onToggle }) => {
  // Set initial main menu as first key
  const [activeMain, setActiveMain] = useState(MAIN_MENU_IDS[0]);
  // Set initial sub menu as first sub-link of active main
  const [activeSub, setActiveSub] = useState(SUB_MENUS[activeMain][0]?.id);

  // When main menu changes, reset sub menu to first sub-link
  const handleMainChange = (id) => {
    setActiveMain(id);
    setActiveSub(SUB_MENUS[id][0]?.id);
  };

  return (
    <div className="flex">
      <SideBarOne
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        activeItem={activeMain}
        onActiveChange={handleMainChange}
      />
      {!isCollapsed && (
        <SideBarTwo
          subMenuItems={SUB_MENUS[activeMain]}
          activeSubItem={activeSub}
          onSubChange={setActiveSub}
        />
      )}
    </div>
  );
};

export default SideBar;
