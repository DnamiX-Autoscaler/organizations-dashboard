import React from "react";
import { LOGO_2, LOGO_1 } from "../../assets";
import { Icon } from '@iconify/react';
import { useTheme } from "../../utils/Theme";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-6 py-4 transition-colors duration-200 bg-white border-b border-gray-200 dark:bg-darkBackground dark:border-darkBackgroundVery">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <img src={isDarkMode ? LOGO_1 : LOGO_2} alt="DnamiX Logo" className="w-auto h-5" />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>Autoscaler</span>
          <span className="px-2 py-1 ml-2 text-xs bg-gray-100 rounded text-darkBackgroundVery dark:bg-darkBackground dark:text-gray-300">
            v0.0.1
          </span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 transition-colors duration-200 bg-white border border-gray-300 rounded-full dark:bg-darkBackground dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery"
        >
          <Icon
            icon={isDarkMode ? "mdi:weather-sunny" : "mdi:weather-night"}
            className="w-5 h-5 text-gray-400 dark:text-gray-300"
          />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 transition-colors duration-200 bg-white border border-gray-300 rounded-full dark:bg-darkBackground dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery">
            <Icon icon="mdi:history" className="w-5 h-5 text-gray-400 dark:text-gray-300" />
            <span className="absolute flex items-center justify-center w-5 h-5 text-[10px] text-white bg-green-500 border-2 border-white dark:border-gray-900 rounded-full -top-1 -right-1">10</span>
          </button>
        </div>

        {/* Messages */}
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 transition-colors duration-200 bg-white border border-gray-300 rounded-full dark:bg-darkBackground dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery">
            <Icon icon="mdi:message-text-outline" className="w-5 h-5 text-gray-400 dark:text-gray-300" />
            <span className="absolute flex items-center justify-center w-5 h-5 text-[10px] text-white bg-[#F5A700] border-2 border-white dark:border-gray-900 rounded-full -top-1 -right-1">10</span>
          </button>
        </div>

        {/* Alerts */}
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 transition-colors duration-200 bg-white border border-gray-300 rounded-full dark:bg-darkBackground dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-darkBackgroundVery">
            <Icon icon="mdi:bell-outline" className="w-5 h-5 text-gray-400 dark:text-gray-300" />
            <span className="absolute flex items-center justify-center w-5 h-5 text-[10px] text-white bg-red-500 border-2 border-white dark:border-gray-900 rounded-full -top-1 -right-1">10</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
