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

const TransactionVolumeWidget = () => {
  const volumeData = [
    { name: "Sep", bitcoin: 2340000, ethereum: 8990000, solana: 12301000 },
    { name: "Oct", bitcoin: 2560000, ethereum: 9660000, solana: 13362000 },
    { name: "Nov", bitcoin: 4160000, ethereum: 19800000, solana: 20947000 },
    { name: "Dec", bitcoin: 4410000, ethereum: 18500000, solana: 17811000 },
    { name: "Jan", bitcoin: 2720000, ethereum: 15810000, solana: 23440000 },
    { name: "Feb", bitcoin: 2400000, ethereum: 21580000, solana: 19101000 },
    { name: "Mar", bitcoin: 2370000, ethereum: 19120000, solana: 21236000 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transaction Volume</h2>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={volumeData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="bitcoin"
            stroke="#f2a900"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="ethereum"
            stroke="#627eea"
            strokeWidth={2}
          />

          <Line
            type="monotone"
            dataKey="solana"
            stroke="#eb0029"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const EntityBreakdownWidget = () => {
  const entityData = [
    { name: "Exchanges", value: 40, color: "#1890ff" },
    { name: "Services", value: 25, color: "#722ed1" },
    { name: "Merchants", value: 15, color: "#13c2c2" },
    { name: "Gambling", value: 8, color: "#fa8c16" },
    { name: "Mixers", value: 5, color: "#eb2f96" },
    { name: "Darkweb", value: 3, color: "#f5222d" },
    { name: "Other", value: 4, color: "#8c8c8c" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Entity Breakdown</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={entityData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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
  const inrData = [
    { name: "Sept", inflow: 5800, outflow: 5200 },
    { name: "Oct", inflow: 7200, outflow: 6800 },
    { name: "Nov", inflow: 6700, outflow: 6200 },
    { name: "Dec", inflow: 7900, outflow: 7400 },
    { name: "Jan", inflow: 4200, outflow: 3800 },
    { name: "Feb", inflow: 5100, outflow: 4600 },
    { name: "Mar", inflow: 6400, outflow: 5900 },
    //{ name: "Apr", inflow: 5800, outflow: 5200 },
    //{ name: "May", inflow: 7200, outflow: 6800 },
    //{ name: "Jun", inflow: 6700, outflow: 6200 },
    //{ name: "Jul", inflow: 7900, outflow: 7400 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">INR Corridor Monitor</h2>
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          India Focus
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={inrData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inflow" fill="#52c41a" name="INR Inflow (Lakhs)" />
          <Bar dataKey="outflow" fill="#f5222d" name="INR Outflow (Lakhs)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const RecentAlertsWidget = () => {
  const alerts = [
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
  ];

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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Alerts</h2>
        <button className="text-blue-600 text-sm">View All</button>
      </div>
      <div className="overflow-hidden overflow-y-auto h-64 pr-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center border-b py-3">
            <div className="flex-grow">
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">
                  {alert.type}
                </div>
                <div
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(
                    alert.risk
                  )}`}
                >
                  {alert.risk}
                </div>
              </div>
              <div className="text-sm text-gray-500">{alert.entity}</div>
              <div className="text-xs text-gray-400">{alert.time}</div>
            </div>
            <button className="text-blue-600 text-xs">Investigate</button>
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
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Darkweb Intelligence</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {darkwebData.map((item, index) => (
              <tr key={index}>
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
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
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
      <div className="mt-4 text-sm text-right"></div>
    </div>
  );
};

const FilterBar = () => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex space-x-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search transactions, addresses, entities..."
          className="pl-10 pr-4 py-2 border rounded-lg w-80"
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
        <select className="border rounded-lg px-3 py-2">
          <option>All Chains</option>
          <option>Bitcoin</option>
          <option>Ethereum</option>
          <option>Solana</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
          <option>All Entity Types</option>
          <option>Exchanges</option>
          <option>Services</option>
          <option>Mixers</option>
          <option>DeFi</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
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
        <span className="ml-1">March 23, 2025 09:45 AM</span>
      </div>
      <button className="bg-gray-100 p-2 rounded-lg">
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

const ChainQuasarDashboard = () => {
  return (
    <div className="flex min-h-screen bg-white p-4">
      <div className=" flex-1 p-0">
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
            <NetworkVisualizationWidget />
          </div>
          <div>
            <INRCorridorMonitorWidget />
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
