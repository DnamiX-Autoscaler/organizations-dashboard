import React, { useState } from "react";
import { Icon } from "@iconify/react";

const AddCommandModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    command: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.command) {
      onSave(formData);
      setFormData({ title: "", command: "", description: "" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl dark:bg-darkBackground">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Custom Command
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Command Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Deploy Application"
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-darkBackgroundVery dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Command *
            </label>
            <textarea
              value={formData.command}
              onChange={(e) =>
                setFormData({ ...formData, command: e.target.value })
              }
              placeholder="e.g., kubectl apply -f deployment.yaml"
              className="w-full px-4 py-3 font-mono text-sm border border-gray-200 rounded-lg resize-none dark:border-gray-700 dark:bg-darkBackgroundVery dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of what this command does"
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-darkBackgroundVery dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-200 rounded-lg dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
            >
              Add Command
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommandModal;
