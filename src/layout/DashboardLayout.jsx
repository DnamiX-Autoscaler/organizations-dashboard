import React, { useState } from "react";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="fixed inset-0 flex bg-backgroundLight">
      {/* Sidebar */}
      <SideBar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6 h-0 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
