import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import SanctionsComplianceWidget from "./sanctioncompliance";
import NetworkVisualizationWidget from "./txnnetwork";
import RiskSummaryWidget from "./risksummarydata";
import TransactionVolumeWidget from "./transactionvolumewidget";
// Etherscan API key

// const TransactionVolumeWidget = () => {
//   const [volumeData, setVolumeData] = useState([
//     { name: "Sep", bitcoin: 2340000, ethereum: 8990000, solana: 12301000 },
//     { name: "Oct", bitcoin: 2560000, ethereum: 9660000, solana: 13362000 },
//     { name: "Nov", bitcoin: 4160000, ethereum: 19800000, solana: 20947000 },
//     { name: "Dec", bitcoin: 4410000, ethereum: 18500000, solana: 17811000 },
//     { name: "Jan", bitcoin: 2720000, ethereum: 15810000, solana: 23440000 },
//     { name: "Feb", bitcoin: 2400000, ethereum: 21580000, solana: 19101000 },
//     { name: "Mar", bitcoin: 2370000, ethereum: 19120000, solana: 21236000 },
//   ]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Function to fetch Ethereum transaction data from Etherscan
//     const fetchEthereumData = async () => {
//       try {
//         setLoading(true);

//         // Get current date and calculate dates for the past 7 months
//         const now = new Date();
//         const months = [];
//         for (let i = 6; i >= 0; i--) {
//           const d = new Date(now);
//           d.setMonth(d.getMonth() - i);
//           const monthName = d.toLocaleString("default", { month: "short" });
//           months.push({
//             name: monthName,
//             startBlock: Math.floor(d.getTime() / 1000), // approximate
//             endBlock: Math.floor(
//               new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime() / 1000
//             ),
//           });
//         }

//         // Create an array of promises for each month's data
//         const promises = months.map(async (month) => {
//           // Fetch block number for start and end timestamps
//           const startBlockUrl = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${month.startBlock}&closest=before&apikey=${ETHERSCAN_API_KEY}`;
//           const endBlockUrl = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${month.endBlock}&closest=before&apikey=${ETHERSCAN_API_KEY}`;

//           const [startBlockRes, endBlockRes] = await Promise.all([
//             fetch(startBlockUrl).then((res) => res.json()),
//             fetch(endBlockUrl).then((res) => res.json()),
//           ]);

//           // Now fetch the daily transactions
//           const statsUrl = `https://api.etherscan.io/api?module=stats&action=dailytx&startdate=${month.startBlock}&enddate=${month.endBlock}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
//           const statsRes = await fetch(statsUrl).then((res) => res.json());

//           // Calculate the total transactions
//           let totalTxs = 0;
//           if (statsRes.status === "1" && Array.isArray(statsRes.result)) {
//             totalTxs = statsRes.result.reduce(
//               (sum, day) => sum + parseInt(day.transactionCount),
//               0
//             );
//           }

//           return {
//             name: month.name,
//             ethereum: totalTxs * 1000, // Convert to volume value (example multiplier)
//             bitcoin:
//               volumeData.find((item) => item.name === month.name)?.bitcoin || 0,
//             solana:
//               volumeData.find((item) => item.name === month.name)?.solana || 0,
//           };
//         });

//         // Wait for all API calls to complete
//         const newData = await Promise.all(promises);
//         setVolumeData(newData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data from Etherscan:", err);
//         setError("Failed to fetch Ethereum transaction data");
//         setLoading(false);
//       }
//     };

//     fetchEthereumData();
//   }, []);

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Transaction Volume</h2>
//         <div className="flex space-x-2">
//           <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
//             7M
//           </span>
//           {loading && (
//             <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
//               Loading...
//             </span>
//           )}
//           {error && (
//             <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
//               API Error
//             </span>
//           )}
//         </div>
//       </div>
//       <ResponsiveContainer width="100%" height={350}>
//         <LineChart
//           data={volumeData}
//           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//           <XAxis dataKey="name" stroke="#888" />
//           <YAxis
//             tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`}
//             stroke="#888"
//           />
//           <Tooltip
//             formatter={(value) => `${(value / 1_000_000).toFixed(2)}M`}
//             contentStyle={{
//               borderRadius: "8px",
//               border: "none",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             }}
//           />
//           <Legend wrapperStyle={{ paddingTop: "10px" }} />
//           <Line
//             type="monotone"
//             dataKey="bitcoin"
//             stroke="#f7931a"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//           <Line
//             type="monotone"
//             dataKey="ethereum"
//             stroke="#627eea"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//           <Line
//             type="monotone"
//             dataKey="solana"
//             stroke="#00ffbd"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

const EntityBreakdownWidget = () => {
  const [entityData, setEntityData] = useState([
    { name: "Exchanges", value: 40, color: "#3b82f6" },
    { name: "Services", value: 25, color: "#8b5cf6" },
    { name: "Merchants", value: 15, color: "#06b6d4" },
    { name: "Gambling", value: 8, color: "#f59e0b" },
    { name: "Mixers", value: 5, color: "#ec4899" },
    { name: "Darkweb", value: 3, color: "#ef4444" },
    { name: "Other", value: 4, color: "#6b7280" },
  ]);

  useEffect(() => {
    // Fetch token information from Etherscan
    const fetchTokenDistribution = async () => {
      try {
        // Get the top tokens by market cap
        const url = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xdac17f958d2ee523a2206206994597c13d831ec7&apikey=${ETHERSCAN_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        // This is just a sample - in a real implementation, you'd fetch data for multiple tokens
        // and categorize them by entity type
        console.log("Etherscan token data:", data);

        // Since Etherscan doesn't directly provide entity breakdown,
        // we're keeping the original data for display purposes
      } catch (error) {
        console.error("Error fetching token distribution:", error);
      }
    };

    fetchTokenDistribution();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-80">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Entity Breakdown</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={entityData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#888" />
          <YAxis dataKey="name" type="category" stroke="#888" />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {entityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const INRCorridorMonitorWidget = () => {
  const [inrData, setInrData] = useState([
    { name: "Sept", inflow: 5800, outflow: 5200 },
    { name: "Oct", inflow: 7200, outflow: 6800 },
    { name: "Nov", inflow: 6700, outflow: 6200 },
    { name: "Dec", inflow: 7900, outflow: 7400 },
    { name: "Jan", inflow: 4200, outflow: 3800 },
    { name: "Feb", inflow: 5100, outflow: 4600 },
    { name: "Mar", inflow: 6400, outflow: 5900 },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-80">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          INR Corridor Monitor
        </h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
          India Focus
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={inrData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          <Bar
            dataKey="inflow"
            fill="#10b981"
            name="INR Inflow (Lakhs)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="outflow"
            fill="#f43f5e"
            name="INR Outflow (Lakhs)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const RecentAlertsWidget = () => {
  const [alerts, setAlerts] = useState([
    {
      id: "A-7291",
      type: "High Risk Transaction",
      entity: "Unknown Exchange",
      time: "14 min ago",
      risk: "High",
    },
    {
      id: "A-7290",
      type: "Sanctions Match",
      entity: "Wallet 0x71f2...8a3b",
      time: "42 min ago",
      risk: "Severe",
    },
    {
      id: "A-7289",
      type: "Suspicious Pattern",
      entity: "Wallet bc1q8...r9p2",
      time: "1 hr ago",
      risk: "Medium",
    },
    {
      id: "A-7288",
      type: "Darkweb Mention",
      entity: "VKontakte Service",
      time: "2 hr ago",
      risk: "High",
    },
    {
      id: "A-7287",
      type: "Large Transaction",
      entity: "Binance",
      time: "3 hr ago",
      risk: "Medium",
    },
  ]);

  useEffect(() => {
    // Fetch the latest Ethereum transactions to look for potentially suspicious ones
    const fetchLatestTransactions = async () => {
      try {
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=0xdac17f958d2ee523a2206206994597c13d831ec7&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1" && Array.isArray(data.result)) {
          // Process transactions to identify potentially suspicious ones
          // This is simplified - in a real app you'd have more sophisticated detection
          const newAlerts = data.result
            .filter((tx) => parseFloat(tx.value) > 1000000000000000000) // Filter large transactions
            .slice(0, 5)
            .map((tx, idx) => {
              const time = new Date(parseInt(tx.timeStamp) * 1000);
              const now = new Date();
              const diffMinutes = Math.floor((now - time) / (1000 * 60));

              let timeString;
              if (diffMinutes < 60) {
                timeString = `${diffMinutes} min ago`;
              } else {
                timeString = `${Math.floor(diffMinutes / 60)} hr ago`;
              }

              return {
                id: `A-${7291 - idx}`,
                type: "Large Transaction",
                entity: `Wallet ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`,
                time: timeString,
                risk: "Medium",
                hash: tx.hash,
              };
            });

          if (newAlerts.length > 0) {
            // Merge with existing alerts but keep only the top 5
            const combinedAlerts = [...newAlerts, ...alerts].slice(0, 5);
            setAlerts(combinedAlerts);
          }
        }
      } catch (error) {
        console.error("Error fetching latest transactions:", error);
      }
    };

    fetchLatestTransactions();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Severe":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-80 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
          View All
        </button>
      </div>
      <div className="overflow-auto flex-grow">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center border-b border-gray-100 py-3"
          >
            <div className="flex-grow">
              <div className="flex items-center">
                <div className="font-medium text-gray-900">{alert.type}</div>
                <div
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                    alert.risk
                  )}`}
                >
                  {alert.risk}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">{alert.entity}</div>
              <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
            </div>
            <button className="text-blue-600 text-xs font-medium px-3 py-1 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
              Investigate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DarkwebActivityWidget = () => {
  const darkwebData = [
    { category: "Marketplace", mentions: 24, addresses: 12 },
    { category: "Drugs", mentions: 18, addresses: 7 },
    { category: "Fraud", mentions: 15, addresses: 9 },
    { category: "Weapons", mentions: 6, addresses: 3 },
    { category: "Forums", mentions: 32, addresses: 15 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-80 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Darkweb Intelligence
      </h2>
      <div className="overflow-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Addresses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {darkwebData.map((item, index) => (
              <tr key={index} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.mentions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.addresses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      index % 2 === 0
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {index % 2 === 0 ? "↑ Increasing" : "↓ Decreasing"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FilterBar = () => {
  const [lastUpdated, setLastUpdated] = useState("March 23, 2025 09:45 AM");

  const handleRefresh = async () => {
    try {
      // Fetch the latest Ethereum block
      const url = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.result) {
        const blockNumber = parseInt(data.result, 16);
        const blockInfoUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${ETHERSCAN_API_KEY}`;
        const blockInfoResponse = await fetch(blockInfoUrl);
        const blockInfo = await blockInfoResponse.json();

        if (blockInfo.status === "1" && blockInfo.result) {
          const timestamp = parseInt(blockInfo.result.timeStamp);
          const date = new Date(timestamp * 1000);
          setLastUpdated(date.toLocaleString());
        }
      }

      // This would trigger a refresh of all widgets
      // In a real app, you'd use context or Redux to propagate this
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div className="flex space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions, addresses, entities..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="flex space-x-2">
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
            <option>All Chains</option>
            <option>Bitcoin</option>
            <option>Ethereum</option>
            <option>Solana</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
            <option>All Entity Types</option>
            <option>Exchanges</option>
            <option>Services</option>
            <option>Mixers</option>
            <option>DeFi</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
            <option>All Risk Levels</option>
            <option>Severe</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-sm">
          <span className="text-gray-500">Last updated:</span>
          <span className="ml-1 text-gray-800 font-medium">{lastUpdated}</span>
        </div>
        <button
          className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={handleRefresh}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

const ChainQuasarDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 p-6">
      <div className="flex-1 ">
        <div className="mb-8 p-4 bg-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 ">
            ChainQuasar
          </h1>
          <p className="text-gray-600">
            Blockchain Transaction Monitoring Dashboard
          </p>
        </div>
        <FilterBar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionVolumeWidget />
          </div>
          <div>
            <RiskSummaryWidget />
          </div>
          <div>
            <EntityBreakdownWidget />
          </div>
          <div>
            <INRCorridorMonitorWidget />
          </div>
          <div>
            <NetworkVisualizationWidget />
          </div>
          <div>
            <SanctionsComplianceWidget />
          </div>
          <div>
            <RecentAlertsWidget />
          </div>
          <div>
            <DarkwebActivityWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainQuasarDashboard;
