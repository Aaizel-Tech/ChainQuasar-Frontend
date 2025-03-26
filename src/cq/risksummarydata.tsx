import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const RiskSummaryWidget = () => {
  // More realistic data distribution, keeping all four categories
  const riskData = [
    { name: "High", value: 48, color: "#ea580c" },
    { name: "Medium", value: 76, color: "#eab308" },
    { name: "Low", value: 165, color: "#16a34a" },
  ];

  const totalAlerts = riskData.reduce((sum, item) => sum + item.value, 0);

  // Calculate percentages for display
  const riskDataWithPercentage = riskData.map((item) => ({
    ...item,
    percentage: ((item.value / totalAlerts) * 100).toFixed(1),
  }));

  return (
    <div className="bg-white w-half rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <AlertTriangle className="text-orange-500 mr-2" size={20} />
          <h2 className="text-xl font-semibold">Risk Summary</h2>
        </div>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
          Updated 2h ago
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskDataWithPercentage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                cornerRadius={4}
              >
                {riskDataWithPercentage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} alerts`, name]}
                contentStyle={{
                  borderRadius: "6px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 gap-4">
            {riskDataWithPercentage.map((item) => (
              <div
                key={item.name}
                className="flex items-center p-3 rounded-lg border-l-4"
                style={{
                  borderLeftColor: item.color,
                  backgroundColor: `${item.color}10`,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {item.percentage}% of total
                  </div>
                </div>
                <div className="text-xl font-bold">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600 text-sm">Total Alerts</span>
                <div className="text-xl font-bold">{totalAlerts}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskSummaryWidget;
