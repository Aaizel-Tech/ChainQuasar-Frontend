import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Etherscan API key
const ETHERSCAN_API_KEY = "C3S6SYSXI3WCXAADZZDWNMXYDMEWMERTG3";

// Helper function to add delay between API calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TransactionVolumeWidget = () => {
  const [volumeData, setVolumeData] = useState([
    { name: "Sep", bitcoin: 2340000, ethereum: 8990000, solana: 12301000 },
    { name: "Oct", bitcoin: 2560000, ethereum: 9660000, solana: 13362000 },
    { name: "Nov", bitcoin: 4160000, ethereum: 19800000, solana: 20947000 },
    { name: "Dec", bitcoin: 4410000, ethereum: 18500000, solana: 17811000 },
    { name: "Jan", bitcoin: 2720000, ethereum: 15810000, solana: 23440000 },
    { name: "Feb", bitcoin: 2400000, ethereum: 21580000, solana: 19101000 },
    { name: "Mar", bitcoin: 2370000, ethereum: 19120000, solana: 21236000 },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch Ethereum transaction data from Etherscan
    const fetchEthereumData = async () => {
      try {
        setLoading(true);

        // Get current date and calculate dates for the past 7 months
        const now = new Date();
        const months = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setMonth(d.getMonth() - i);
          const monthName = d.toLocaleString("default", { month: "short" });
          months.push({
            name: monthName,
            startBlock: Math.floor(d.getTime() / 1000), // approximate
            endBlock: Math.floor(
              new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime() / 1000
            ),
          });
        }

        // Process months sequentially with delays to avoid rate limiting
        const newData = [];
        for (const month of months) {
          // Fetch block number for start timestamp
          const startBlockUrl = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${month.startBlock}&closest=before&apikey=${ETHERSCAN_API_KEY}`;
          const startBlockRes = await fetch(startBlockUrl).then((res) =>
            res.json()
          );

          // Add delay to prevent rate limiting
          await delay(250);

          // Fetch block number for end timestamp
          const endBlockUrl = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${month.endBlock}&closest=before&apikey=${ETHERSCAN_API_KEY}`;
          const endBlockRes = await fetch(endBlockUrl).then((res) =>
            res.json()
          );

          // Add delay to prevent rate limiting
          await delay(250);

          // Check if we received valid responses
          if (startBlockRes.status !== "1" || endBlockRes.status !== "1") {
            console.warn(
              `Issue with block data for ${month.name}:`,
              startBlockRes,
              endBlockRes
            );
            // Use existing data as fallback
            newData.push({
              name: month.name,
              ethereum:
                volumeData.find((item) => item.name === month.name)?.ethereum ||
                0,
              bitcoin:
                volumeData.find((item) => item.name === month.name)?.bitcoin ||
                0,
              solana:
                volumeData.find((item) => item.name === month.name)?.solana ||
                0,
            });
            continue;
          }

          // Now fetch the daily transactions
          const startBlock = startBlockRes.result;
          const endBlock = endBlockRes.result;

          // Use block number range instead of date range for more reliable data
          const statsUrl = `https://api.etherscan.io/api?module=stats&action=dailytx&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

          // Add delay to prevent rate limiting
          await delay(250);

          const statsRes = await fetch(statsUrl).then((res) => res.json());

          // Calculate the total transactions
          let totalTxs = 0;
          if (statsRes.status === "1" && Array.isArray(statsRes.result)) {
            totalTxs = statsRes.result.reduce(
              (sum, day) => sum + parseInt(day.transactionCount),
              0
            );

            newData.push({
              name: month.name,
              ethereum: totalTxs * 1000, // Convert to volume value
              bitcoin:
                volumeData.find((item) => item.name === month.name)?.bitcoin ||
                0,
              solana:
                volumeData.find((item) => item.name === month.name)?.solana ||
                0,
            });
          } else {
            console.warn(`Issue with stats data for ${month.name}:`, statsRes);
            // Use existing data as fallback
            newData.push({
              name: month.name,
              ethereum:
                volumeData.find((item) => item.name === month.name)?.ethereum ||
                0,
              bitcoin:
                volumeData.find((item) => item.name === month.name)?.bitcoin ||
                0,
              solana:
                volumeData.find((item) => item.name === month.name)?.solana ||
                0,
            });
          }

          // Add a longer delay between months to be safe
          await delay(300);
        }

        if (newData.length > 0) {
          setVolumeData(newData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data from Etherscan:", err);
        setError("Failed to fetch Ethereum transaction data");
        setLoading(false);
      }
    };

    fetchEthereumData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transaction Volume</h2>
        <div className="flex space-x-2">
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            7M
          </span>
          {loading && (
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
              Loading...
            </span>
          )}
          {error && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              {error}
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={volumeData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis
            tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
            stroke="#888"
          />
          <Tooltip
            formatter={(value) => `${(value / 1_000_000).toFixed(2)}M`}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          <Line
            type="monotone"
            dataKey="bitcoin"
            stroke="#f7931a"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="ethereum"
            stroke="#627eea"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="solana"
            stroke="#00ffbd"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionVolumeWidget;
