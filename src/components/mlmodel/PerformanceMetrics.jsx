import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { Icon } from "@iconify/react";

const PerformanceMetrics = ({ data }) => {
    return (
        <div className="col-span-2 p-6 bg-white border border-gray-200 rounded-lg dark:bg-darkBackground dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                        <Icon icon="mdi:speedometer" className="w-5 h-5 text-primary" />
                        System Performance
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Latency vs Request Rates
                    </p>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="time" stroke="#9CA3AF" style={{ fontSize: "10px" }} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" style={{ fontSize: "10px" }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" style={{ fontSize: "10px" }} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="requests" name="Requests/sec" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar yAxisId="right" dataKey="latency" name="Latency (ms)" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceMetrics;
