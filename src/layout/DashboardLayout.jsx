import React, { useState } from "react";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-backgroundLight">
      {/* Sidebar */}
      <SideBar
        isCollapsed={isSidebarCollapsed}
        onToggle={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
