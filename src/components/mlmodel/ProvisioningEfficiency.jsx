import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Icon } from "@iconify/react";

const ProvisioningEfficiency = ({ data }) => {
    // Calculate efficiency from data (Exact Match percentage)
    const exactMatch = data?.find(d => d.name === 'Exact Match')?.value || 0;
    const underProv = data?.find(d => d.name === 'Under-provisioned')?.value || 0;
    const overProv = data?.find(d => d.name === 'Over-provisioned')?.value || 0;

    // Determine status color and text
    let statusColor = "text-emerald-500";
    let statusText = "Excellent";
    if (exactMatch < 50) {
        statusColor = "text-red-500";
        statusText = "Poor";
    } else if (exactMatch < 70) {
        statusColor = "text-yellow-500";
        statusText = "Fair";
    } else if (exactMatch < 85) {
        statusColor = "text-green-500";
        statusText = "Good";
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-darkBackground dark:border-gray-700 h-full">
            <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Icon icon="mdi:target-account" className="w-5 h-5 text-primary" />
                    Provisioning Efficiency
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Model prediction accuracy vs actual requirements
                </p>
            </div>

            <div className="h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            animationDuration={500}
                        >
                            {data?.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    strokeWidth={0}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Dynamic Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[75%] text-center">
                    <span className={`text-3xl font-bold ${statusColor}`}>
                        {exactMatch}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{statusText}</p>
                </div>
            </div>

            {/* Stats breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2 text-center">
                <div>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs text-gray-500">Under</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">{underProv}%</span>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-gray-500">Exact</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{exactMatch}%</span>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs text-gray-500">Over</span>
                    </div>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{overProv}%</span>
                </div>
            </div>
        </div>
    );
};

export default ProvisioningEfficiency;
