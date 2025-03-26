import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Transaction Volume Chart component with network filtering and translations
const TransactionVolumeChart = ({
  selectedCurrency = "RUB",
  selectedTimeframe = "30d",
  selectedLanguage = "en",
  translations,
}) => {
  // Use provided translations or fallback to default ones
  const t = translations?.[selectedLanguage] || {
    title:
      selectedLanguage === "ru" ? "Объем транзакций" : "Transaction Volume",
    showAllNetworks: selectedLanguage === "ru" ? "Все сети" : "All Networks",
    billion: selectedLanguage === "ru" ? "млрд" : "B",
    million: selectedLanguage === "ru" ? "млн" : "M",
    thousand: selectedLanguage === "ru" ? "тыс" : "K",
    show: selectedLanguage === "ru" ? "Показать:" : "Show:",
    inbound: selectedLanguage === "ru" ? "Входящие" : "Inbound",
    outbound: selectedLanguage === "ru" ? "Исходящие" : "Outbound",
  };

  // Mock data for different networks and currencies
  const networkData = {
    bitcoin: [
      { name: "Jan", RUB: 10.2, KZT: 8.5, USD: 1.8 },
      { name: "Feb", RUB: 11.5, KZT: 9.4, USD: 2.0 },
      { name: "Mar", RUB: 13.1, KZT: 10.8, USD: 2.3 },
      { name: "Apr", RUB: 15.3, KZT: 12.5, USD: 2.7 },
      { name: "May", RUB: 17.2, KZT: 14.1, USD: 3.0 },
      { name: "Jun", RUB: 19.4, KZT: 15.9, USD: 3.4 },
      { name: "Jul", RUB: 21.5, KZT: 17.6, USD: 3.8 },
    ],
    ethereum: [
      { name: "Jan", RUB: 8.9, KZT: 6.6, USD: 1.5 },
      { name: "Feb", RUB: 10.3, KZT: 7.8, USD: 1.7 },
      { name: "Mar", RUB: 12.1, KZT: 9.2, USD: 2.0 },
      { name: "Apr", RUB: 14.2, KZT: 10.8, USD: 2.4 },
      { name: "May", RUB: 15.9, KZT: 12.1, USD: 2.6 },
      { name: "Jun", RUB: 17.8, KZT: 13.6, USD: 2.9 },
      { name: "Jul", RUB: 19.3, KZT: 14.7, USD: 3.2 },
    ],
    tron: [
      { name: "Jan", RUB: 5.4, KZT: 3.2, USD: 0.9 },
      { name: "Feb", RUB: 6.3, KZT: 4.2, USD: 1.1 },
      { name: "Mar", RUB: 7.5, KZT: 4.9, USD: 1.2 },
      { name: "Apr", RUB: 8.7, KZT: 5.8, USD: 1.3 },
      { name: "May", RUB: 9.7, KZT: 6.4, USD: 1.5 },
      { name: "Jun", RUB: 11.1, KZT: 7.3, USD: 1.7 },
      { name: "Jul", RUB: 12.3, KZT: 8.2, USD: 1.8 },
    ],
  };

  // Networks available for selection
  const networks = [
    { id: "all", label: t.showAllNetworks },
    { id: "bitcoin", label: "Bitcoin" },
    { id: "ethereum", label: "Ethereum" },
    { id: "tron", label: "Tron" },
  ];

  // Selected network state
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  // Chart data state
  const [chartData, setChartData] = useState([]);

  // Update chart data when network or currency selection changes
  useEffect(() => {
    if (selectedNetwork === "all") {
      // Compute cumulative data for all networks
      const cumulativeData = networkData.bitcoin.map((item, index) => {
        const bitcoinValue = networkData.bitcoin[index][selectedCurrency];
        const ethereumValue = networkData.ethereum[index][selectedCurrency];
        const tronValue = networkData.tron[index][selectedCurrency];

        return {
          name: item.name,
          [selectedCurrency]: bitcoinValue + ethereumValue + tronValue,
          Bitcoin: bitcoinValue,
          Ethereum: ethereumValue,
          Tron: tronValue,
        };
      });
      setChartData(cumulativeData);
    } else {
      // Single network data with additional details
      const singleNetworkData = networkData[selectedNetwork].map((item) => ({
        name: item.name,
        [selectedCurrency]: item[selectedCurrency],
      }));
      setChartData(singleNetworkData);
    }
  }, [selectedNetwork, selectedCurrency]);

  // Custom tooltip component for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
          <p className="text-gray-300">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-lg font-semibold"
              style={{ color: getNetworkColor(entry.name) }}
            >
              {`${entry.name}: ${entry.value} ${t.billion}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Legend formatter to ensure translations
  const legendFormatter = (value) => {
    if (value === "Bitcoin" || value === "Ethereum" || value === "Tron") {
      return value;
    }
    // Translate currency names if needed
    return value;
  };

  // Get color for network visualization
  const getNetworkColor = (network) => {
    switch (network) {
      case "Bitcoin":
        return "#F7931A"; // Bitcoin orange
      case "Ethereum":
        return "#627EEA"; // Ethereum blue
      case "Tron":
        return "#EF0027"; // Tron red
      default:
        return "#6366F1"; // Default indigo
    }
  };

  // Handle network selection change
  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.title}
        </h2>
        <div className="flex items-center">
          <span className="text-gray-600 dark:text-gray-300 mr-2">
            {t.show}
          </span>
          <select
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={selectedNetwork}
            onChange={handleNetworkChange}
          >
            {networks.map((network) => (
              <option key={network.id} value={network.id}>
                {network.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
            {/* Add gradients for each network */}
            <linearGradient id="colorBitcoin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F7931A" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEthereum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#627EEA" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#627EEA" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF0027" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF0027" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#374151"
            opacity={0.1}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280" }}
            axisLine={{ stroke: "#9CA3AF", strokeWidth: 0.5 }}
            tickLine={{ stroke: "#9CA3AF" }}
          />
          <YAxis
            tick={{ fill: "#6B7280" }}
            axisLine={{ stroke: "#9CA3AF", strokeWidth: 0.5 }}
            tickLine={{ stroke: "#9CA3AF" }}
            tickFormatter={(value) => `${value} ${t.billion}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={legendFormatter}
            iconType="circle"
            wrapperStyle={{ paddingTop: "10px" }}
          />

          {/* Main area for the selected currency */}
          {selectedNetwork === "all" ? (
            // Show the composite view for all networks
            <>
              <Area
                type="monotone"
                dataKey={selectedCurrency}
                stroke="#6366F1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVolume)"
                activeDot={{
                  r: 8,
                  stroke: "#4F46E5",
                  strokeWidth: 2,
                  fill: "#6366F1",
                }}
              />
              <Area
                type="monotone"
                dataKey="Bitcoin"
                stroke="#F7931A"
                strokeWidth={2}
                fillOpacity={0}
                activeDot={{
                  r: 6,
                  stroke: "#F7931A",
                  strokeWidth: 1,
                  fill: "#F7931A",
                }}
              />
              <Area
                type="monotone"
                dataKey="Ethereum"
                stroke="#627EEA"
                strokeWidth={2}
                fillOpacity={0}
                activeDot={{
                  r: 6,
                  stroke: "#627EEA",
                  strokeWidth: 1,
                  fill: "#627EEA",
                }}
              />
              <Area
                type="monotone"
                dataKey="Tron"
                stroke="#EF0027"
                strokeWidth={2}
                fillOpacity={0}
                activeDot={{
                  r: 6,
                  stroke: "#EF0027",
                  strokeWidth: 1,
                  fill: "#EF0027",
                }}
              />
            </>
          ) : (
            // Show just the selected network
            <Area
              type="monotone"
              dataKey={selectedCurrency}
              stroke={getNetworkColor(selectedNetwork)}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color${
                selectedNetwork.charAt(0).toUpperCase() +
                selectedNetwork.slice(1)
              })`}
              activeDot={{
                r: 8,
                stroke: getNetworkColor(selectedNetwork),
                strokeWidth: 2,
                fill: getNetworkColor(selectedNetwork),
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionVolumeChart;
