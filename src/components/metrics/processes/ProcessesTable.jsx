import React from "react";
import Table from "../../common/Table";

const columns = [
  {
    label: "Cluster Id",
    key: "clusterId",
    icon: "mdi:information-outline",
    bold: true,
  },
  { label: "Time Stamps", key: "timeStamp", icon: "mdi:information-outline" },
  { label: "Window Size", key: "windowSize" },
  { label: "Namespace", key: "namespace" },
  {
    label: "Service Name",
    key: "serviceName",
    icon: "mdi:information-outline",
  },
  { label: "Node Name", key: "nodeName", icon: "mdi:information-outline" },
];

const ProcessesTable = ({ data }) => (
  <Table
    columns={columns}
    data={data}
    empty="No data found matching your filters"
  />
);

export default ProcessesTable;
