import React from "react";
import SideBarOne from "./side_bar/SideBarOne";
import SideBarTwo from "./side_bar/SideBarTwo";

const SideBar = ({ isCollapsed, onToggle }) => {
  return (
    <div className="flex">
      {/* Primary Sidebar */}
      <SideBarOne isCollapsed={isCollapsed} onToggle={onToggle} />

      {/* Secondary Sidebar */}
      {!isCollapsed && <SideBarTwo />}
    </div>
  );
};

export default SideBar;
