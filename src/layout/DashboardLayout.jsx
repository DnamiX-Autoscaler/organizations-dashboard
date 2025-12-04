import React, { useState } from "react";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";
import { ThemeProvider } from "../utils/Theme";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <div className="fixed inset-0 flex transition-colors duration-200 bg-backgroundLight dark:bg-bac">
        {/* Sidebar */}
        <SideBar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 h-0 min-h-0 p-6 overflow-y-auto transition-colors duration-200 bg-white dark:bg-darkBackgroundVery">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;
