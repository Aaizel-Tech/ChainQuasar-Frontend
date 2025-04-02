import { useState, useEffect, useCallback } from "react";
import {
  Database,
  Search,
  RefreshCw,
  Activity,
  Eye,
  Users,
  AlertTriangle,
  Filter,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const BlockchainAnalyticsDashboard = () => {
  const [selectedChain, setSelectedChain] = useState("all");
  const [timeRange, setTimeRange] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    activeAddresses: 0,
    identifiedEntities: 0,
    riskAlerts: 0,
  });

  // State for CSV data
  const [csvData, setCsvData] = useState([]);

  // State for chart data derived from CSV
  const [transactionVolumeData, setTransactionVolumeData] = useState([]);
  const [riskDistributionData, setRiskDistributionData] = useState([]);
  const [entityCategoryData, setEntityCategoryData] = useState([]);
  const [addressActivityData, setAddressActivityData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Function to process CSV data and transform it for charts
  const processCSVData = useCallback((data) => {
    // Skip processing if no data
    if (!data || data.length === 0) return;

    // Assign random blockchain to each transaction (Bitcoin or Ethereum)
    const dataWithChain = data.map((tx) => ({
      ...tx,
      chain: Math.random() > 0.5 ? "Bitcoin" : "Ethereum",
    }));

    // Generate dates for the last week
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }

    // Distribute transactions across dates
    const txPerDate = {};
    dates.forEach((date) => {
      txPerDate[date] = {
        date,
        bitcoin: 0,
        ethereum: 0,
        volume: 0,
      };
    });

    // Distribute transactions randomly across dates
    dataWithChain.forEach((tx) => {
      const randomDateIndex = Math.floor(Math.random() * dates.length);
      const date = dates[randomDateIndex];

      const value = parseFloat(tx.value) || 0;

      if (tx.chain === "Bitcoin") {
        txPerDate[date].bitcoin += value;
      } else {
        txPerDate[date].ethereum += value;
      }

      txPerDate[date].volume += value;
    });

    const volumeByDate = Object.values(txPerDate);
    setTransactionVolumeData(volumeByDate);

    // Process active addresses data
    const activeAddresses = dates.map((date) => {
      // Randomly generate number of active addresses for each date
      const baseCount = Math.floor(dataWithChain.length * 0.2);
      const random = Math.floor(Math.random() * baseCount);

      return {
        date,
        active: baseCount + random,
      };
    });

    setAddressActivityData(activeAddresses);

    // Analyze transaction sizes for entity categorization
    const sizeBuckets = {
      "Small (<1000)": 0,
      "Medium (1000-5000)": 0,
      "Large (5000-10000)": 0,
      "Very Large (>10000)": 0,
    };

    dataWithChain.forEach((tx) => {
      const size = parseInt(tx.size) || 0;
      if (size < 1000) sizeBuckets["Small (<1000)"]++;
      else if (size < 5000) sizeBuckets["Medium (1000-5000)"]++;
      else if (size < 10000) sizeBuckets["Large (5000-10000)"]++;
      else sizeBuckets["Very Large (>10000)"]++;
    });

    const entityData = Object.entries(sizeBuckets).map(([name, count]) => ({
      name,
      count,
    }));
    setEntityCategoryData(entityData);

    // Determine risk categories based on transaction risk columns
    const riskCategories = {
      "Low Risk": 0,
      "Medium Risk": 0,
      "High Risk": 0,
    };

    const riskColors = {
      "Low Risk": "#4CAF50",
      "Medium Risk": "#FFC107",
      "High Risk": "#F44336",
    };

    dataWithChain.forEach((tx) => {
      if (tx.High_Risk === "1") riskCategories["High Risk"]++;
      else if (tx.Medium_Risk === "1") riskCategories["Medium Risk"]++;
      else riskCategories["Low Risk"]++;
    });

    const riskData = Object.entries(riskCategories).map(([name, value]) => ({
      name,
      value,
      color: riskColors[name],
    }));

    setRiskDistributionData(riskData);

    // Filter high risk transactions for recent activity
    const highRiskTransactions = dataWithChain.filter(
      (tx) => tx.High_Risk === "1"
    );
    const recentHighRiskTxs = highRiskTransactions.slice(0, 5).map((tx) => {
      let riskLevel = "Low";
      let riskType = "Normal Transaction";

      if (tx.High_Risk === "1") {
        riskLevel = "High";
        riskType =
          tx.high_value_tx === "1"
            ? "Large Value"
            : tx.repeat_receiver_tx === "1"
            ? "Suspicious Pattern"
            : "High Risk";
      } else if (tx.Medium_Risk === "1") {
        riskLevel = "Medium";
        riskType = "Moderate Risk";
      }

      return {
        txId: tx.tx_id || tx.tx_hash || "Unknown",
        time: new Date().toISOString(), // Simulated current time
        chain: tx.chain,
        amount: `${tx.value || 0} ${tx.chain === "Bitcoin" ? "BTC" : "ETH"}`,
        riskLevel,
        riskType,
      };
    });

    setRecentActivity(
      recentHighRiskTxs.length > 0
        ? recentHighRiskTxs
        : highRiskTransactions.slice(0, 5).map((tx) => ({
            txId: tx.tx_id || tx.tx_hash || "Unknown",
            time: new Date().toISOString(),
            chain: tx.chain,
            amount: `${tx.value || 0} ${
              tx.chain === "Bitcoin" ? "BTC" : "ETH"
            }`,
            riskLevel: "High",
            riskType: "High Risk Transaction",
          }))
    );

    // Update stats
    setStats({
      totalTransactions: dataWithChain.length,
      activeAddresses: new Set(
        [
          ...dataWithChain.map((tx) => tx.sender_address),
          ...dataWithChain.map((tx) => tx.receiver_address),
        ].filter(Boolean)
      ).size,
      identifiedEntities: Math.floor(dataWithChain.length * 0.15), // Mock value: assume 15% of transactions are from identified entities
      riskAlerts: dataWithChain.filter((tx) => tx.High_Risk === "1").length,
    });
  }, []);

  // Load CSV data on component mount
  useEffect(() => {
    const loadCSVData = async () => {
      setIsLoading(true);

      try {
        // In a real app, this would be a fetch request to the actual CSV file
        // For this demo, we'll simulate some data
        const mockData = Array(50)
          .fill()
          .map((_, i) => ({
            tx_id: `tx_${i}`,
            tx_hash: `0x${Math.random().toString(16).substring(2, 10)}`,
            sender_address: `0x${Math.random().toString(16).substring(2, 42)}`,
            receiver_address: `0x${Math.random()
              .toString(16)
              .substring(2, 42)}`,
            value: (Math.random() * 20).toFixed(4),
            fee: (Math.random() * 0.01).toFixed(6),
            size: Math.floor(Math.random() * 15000),
            vsize: Math.floor(Math.random() * 10000),
            weight: Math.floor(Math.random() * 20000),
            scriptPubKey_hex: `0x${Math.random()
              .toString(16)
              .substring(2, 30)}`,
            high_value_tx: Math.random() > 0.8 ? "1" : "0",
            repeat_receiver_tx: Math.random() > 0.9 ? "1" : "0",
            high_out_degree: Math.random() > 0.8 ? "1" : "0",
            Low_Risk: Math.random() > 0.4 ? "1" : "0",
            Medium_Risk: Math.random() > 0.7 ? "1" : "0",
            High_Risk: Math.random() > 0.8 ? "1" : "0",
          }));

        setCsvData(mockData);
        processCSVData(mockData);
      } catch (error) {
        console.error("Error loading CSV data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCSVData();
  }, [processCSVData]);

  // Simulate data loading when filters change
  useEffect(() => {
    if (csvData.length === 0) return;

    const loadData = async () => {
      setIsLoading(true);
      // In a real app, this would filter the data based on selection
      await new Promise((resolve) => setTimeout(resolve, 800));
      processCSVData(csvData);
      setIsLoading(false);
    };

    loadData();
  }, [selectedChain, timeRange, csvData, processCSVData]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-lg font-semibold text-gray-900">
              Blockchain Analytics Platform
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search addresses, entities, transactions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blockchain
              </label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Chains</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>
            <button className="mt-6 bg-blue-600 text-white rounded-md px-4 py-2 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
          {isLoading && (
            <div className="flex items-center text-blue-600">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading data...
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Transactions
                </h3>
                <p className="text-2xl font-bold">
                  {stats.totalTransactions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Active Addresses
                </h3>
                <p className="text-2xl font-bold">
                  {stats.activeAddresses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Identified Entities
                </h3>
                <p className="text-2xl font-bold">
                  {stats.identifiedEntities.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Risk Alerts
                </h3>
                <p className="text-2xl font-bold">
                  {stats.riskAlerts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Transaction Volume Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Transaction Volume
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={transactionVolumeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="bitcoin"
                    stroke="#F7931A"
                    fill="#F7931A"
                    fillOpacity={0.2}
                    name="Bitcoin"
                  />
                  <Area
                    type="monotone"
                    dataKey="ethereum"
                    stroke="#627EEA"
                    fill="#627EEA"
                    fillOpacity={0.2}
                    name="Ethereum"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Risk Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} transactions`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Entity Categories Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Transaction Size Categories
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={entityCategoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Addresses Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Active Addresses
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={addressActivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Active Addresses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent High-Risk Activity
          </h2>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {activity.txId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.chain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activity.riskLevel === "High"
                              ? "bg-red-100 text-red-800"
                              : activity.riskLevel === "Medium"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {activity.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.riskType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                No high-risk transaction data available.
              </p>
            </div>
          )}
        </div>

        {/* CSV Data Preview */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-600" />
            CSV Data Preview
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({csvData.length} records)
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    tx_id/tx_hash
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    sender_address
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    receiver_address
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    value
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    fee
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    size
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    high_value_tx
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    repeat_receiver_tx
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    high_out_degree
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Low_Risk
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medium_Risk
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    High_Risk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-blue-600">
                      {row.tx_id || row.tx_hash || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.sender_address
                        ? `${row.sender_address.substring(
                            0,
                            8
                          )}...${row.sender_address.substring(
                            row.sender_address.length - 6
                          )}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.receiver_address
                        ? `${row.receiver_address.substring(
                            0,
                            8
                          )}...${row.receiver_address.substring(
                            row.receiver_address.length - 6
                          )}`
                        : "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.value || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.fee || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.size || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.high_value_tx || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.repeat_receiver_tx || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.high_out_degree || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.Low_Risk || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.Medium_Risk || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.High_Risk || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 5 && (
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing 5 of {csvData.length} records
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlockchainAnalyticsDashboard;
