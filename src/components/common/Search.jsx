import React from "react";
import { Icon } from "@iconify/react";

const Search = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative">
    <div className="absolute z-10 -translate-y-1/2 pointer-events-none left-3 top-1/2">
      <Icon
        icon="iconamoon:search-light"
        className="w-5 h-5 text-gray-400 dark:text-gray-500"
      />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-2 pl-10 pr-4 text-sm text-gray-700 transition-all duration-200 border rounded-full bg-white/60 dark:bg-darkBackground/60 backdrop-blur-md border-gray-200/50 dark:border-gray-600/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:bg-white/80 dark:hover:bg-darkBackground/80 min-w-[200px]"
    />
  </div>
);

export default Search;
