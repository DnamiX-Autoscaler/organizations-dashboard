import React, { useState } from "react";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";
import { ThemeProvider } from "../utils/Theme";
import { RouteProvider } from "../utils/RouteContext";
import LiveAlertSimulation from "../components/common/LiveAlertSimulation";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <RouteProvider>
        <div className="fixed inset-0 flex transition-colors duration-200 bg-backgroundLight dark:bg-darkBackgroundVery">
          <LiveAlertSimulation />
          <SideBar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

          <div className="flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300">
            <Header />
            <main className="flex-1 h-0 min-h-0 p-6 overflow-y-auto transition-colors duration-200 bg-white dark:bg-darkBackgroundVery">
              {children}
            </main>
          </div>
        </div>
      </RouteProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
