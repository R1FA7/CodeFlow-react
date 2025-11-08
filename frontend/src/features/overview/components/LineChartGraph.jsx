import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Format date
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-purple-500/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm mb-1">
          {formatDateTime(data.contestDate)}
        </p>
        <p className="text-purple-400 font-bold text-lg">
          Rating: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const LineChartComponent = ({ data, height = 350 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {/* Grid */}
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.9} />

        <XAxis dataKey="contestDate" tick={false} />

        {/* Y-Axis */}
        <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legend */}
        <Legend wrapperStyle={{ color: "#9CA3AF" }} iconType="line" />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ stroke: "#f472b6", strokeWidth: 2, fill: "#fff", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const LineChartGraph = React.memo(LineChartComponent);
