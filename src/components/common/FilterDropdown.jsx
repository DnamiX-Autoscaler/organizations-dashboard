import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

const FilterDropdown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 pr-10 text-sm  text-gray-700 bg-white/60 dark:bg-darkBackground/60 backdrop-blur-md border border-gray-200 dark:border-gray-600/50 rounded-full dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 min-w-[200px] hover:bg-white/80 dark:hover:bg-darkBackground/80"
      >
        <span
          className={selectedOption ? "" : "text-gray-500 dark:text-gray-400"}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="absolute w-5 h-5 text-gray-400 transition-transform duration-200 transform -translate-y-1/2 pointer-events-none dark:text-gray-500 right-3 top-1/2"
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 overflow-hidden overflow-y-auto border shadow-xl rounded-xl bg-white/90 dark:bg-darkBackground/90 backdrop-blur-xl border-gray-200/50 dark:border-gray-600/50 max-h-60">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === option.value
                  ? "bg-primary/10 text-primary dark:bg-primary/20 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
