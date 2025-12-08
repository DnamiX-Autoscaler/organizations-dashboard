import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const PerformanceGraph = ({ data, color = "#3B82F6", height = 60 }) => (
    <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${color})`}
                isAnimationActive={false}
            />
        </AreaChart>
    </ResponsiveContainer>
);

export default PerformanceGraph;
