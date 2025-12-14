import React, { useState } from "react";
import { Icon } from "@iconify/react";

const CommandCard = ({ command, onDelete, isCustom = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 transition-all bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {command.title}
            </h3>
            {isCustom && (
              <span className="px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded">
                Custom
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {command.description}
          </p>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 hover:text-primary"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            <Icon
              icon={copied ? "mdi:check" : "mdi:content-copy"}
              className="w-4 h-4"
            />
          </button>
          {isCustom && (
            <button
              onClick={() => onDelete(command.id)}
              className="p-2 text-gray-500 transition-colors rounded hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-gray-400 hover:text-red-500"
              title="Delete command"
            >
              <Icon icon="mdi:delete" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <code className="block p-3 overflow-x-auto font-mono text-xs text-gray-800 rounded bg-gray-50 dark:bg-darkBackgroundVery dark:text-gray-200">
          {command.command}
        </code>
      </div>
    </div>
  );
};

export default CommandCard;
