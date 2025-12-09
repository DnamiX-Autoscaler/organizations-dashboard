import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { processData } from "../../../data";
import TitleHeader from "../../../components/common/TitleHeader";
import TabSection from "../../../components/common/TabSection";
import FilterDropdown from "../../../components/common/FilterDropdown";
import ClearFilterButton from "../../../components/common/ClearFilterButton";
import ProcessesTable from "../../../components/metrics/processes/ProcessesTable";
import ProcessesGraph from "../../../components/metrics/processes/ProcessesGraph";

const LevelUsages = () => {
  const [activeTab, setActiveTab] = useState("table");


  const tabs = [
    { key: "table", label: "Table", icon: "mdi:table" },
    { key: "graph", label: "Graph", icon: "mdi:chart-line" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <TitleHeader
        title="Level Usages"
        subtitle="Detailed insights into process levels (Node, Pod, Application, Service Mesh)"
      />

      {/* Tabs Section */}
      <TabSection
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      

      {/* Table Section */}
      {activeTab === "table" && <ProcessesTable  />}

      {/* Graph View */}
      {activeTab === "graph" && <ProcessesGraph  />}
    </div>
  );
};

export default LevelUsages;
