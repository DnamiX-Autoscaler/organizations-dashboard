import React from "react";

const TitleHeader = ({ title, subtitle }) => (
  <div className="flex items-center mb-6 space-x-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default TitleHeader;
