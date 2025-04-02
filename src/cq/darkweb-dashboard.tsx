import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  Search,
  Filter,
  Skull,
  Globe,
  Database,
  BarChart2,
  Calendar,
  Shield,
  Clock,
  Users,
  Download,
  RefreshCw,
} from "lucide-react";

// Sample data - in a real implementation, this would come from your API
const statisticsData = {
  totalSites: 342,
  totalAddresses: 1589,
  addressesByType: [
    { _id: "bitcoin", count: 872 },
    { _id: "ethereum", count: 598 },
    { _id: "solana", count: 119 },
  ],
  sitesByCategory: [
    { _id: "marketplace", count: 98 },
    { _id: "drugs", count: 76 },
    { _id: "weapons", count: 24 },
    { _id: "fraud", count: 53 },
    { _id: "hacking", count: 42 },
    { _id: "forum", count: 31 },
    { _id: "other", count: 18 },
  ],
  addressesByCategory: [
    { _id: "marketplace", count: 683 },
    { _id: "drugs", count: 412 },
    { _id: "weapons", count: 156 },
    { _id: "fraud", count: 234 },
    { _id: "hacking", count: 104 },
  ],
  crawlHistory: [
    { date: "2024-01-01", newSites: 12, newAddresses: 53 },
    { date: "2024-01-08", newSites: 8, newAddresses: 47 },
    { date: "2024-01-15", newSites: 15, newAddresses: 76 },
    { date: "2024-01-22", newSites: 5, newAddresses: 32 },
    { date: "2024-01-29", newSites: 11, newAddresses: 64 },
    { date: "2024-02-05", newSites: 7, newAddresses: 42 },
  ],
};

const recentAddressesData = [
  {
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    type: "bitcoin",
    category: "marketplace",
    firstSeen: "2024-02-06T12:45:22Z",
    siteCount: 3,
    confidence: 0.85,
  },
  {
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    type: "ethereum",
    category: "drugs",
    firstSeen: "2024-02-06T10:23:11Z",
    siteCount: 2,
    confidence: 0.78,
  },
  {
    address:
      "49oFBzfsTBgmgXSKN91WU8eJU4vJPhWDPiKjCCsxrwgTGRCvVDQHxqEGtdTFUQbZKJA1uKCceNitwpNbGwwdvwqN5s8GocE",
    type: "solana",
    category: "weapons",
    firstSeen: "2024-02-05T18:14:09Z",
    siteCount: 1,
    confidence: 0.92,
  },
  {
    address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    type: "bitcoin",
    category: "fraud",
    firstSeen: "2024-02-05T09:33:47Z",
    siteCount: 4,
    confidence: 0.89,
  },
  {
    address: "0x6e8f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f",
    type: "ethereum",
    category: "hacking",
    firstSeen: "2024-02-04T22:51:32Z",
    siteCount: 2,
    confidence: 0.76,
  },
];

const recentSitesData = [
  {
    url: "http://abcdef***.onion",
    title: "Dark Market Alpha",
    category: "marketplace",
    lastCrawled: "2024-02-07T14:23:45Z",
    addressesFound: 28,
    status: "active",
  },
  {
    url: "http://ghijkl***.onion",
    title: "Hacker Forum Beta",
    category: "hacking",
    lastCrawled: "2024-02-07T12:11:32Z",
    addressesFound: 14,
    status: "active",
  },
  {
    url: "http://mnopqr***.onion",
    title: "Weapons Exchange",
    category: "weapons",
    lastCrawled: "2024-02-07T09:45:18Z",
    addressesFound: 9,
    status: "active",
  },
  {
    url: "http://stuvwx***.onion",
    title: "CC Dumps Forum",
    category: "fraud",
    lastCrawled: "2024-02-06T22:37:09Z",
    addressesFound: 22,
    status: "active",
  },
  {
    url: "http://yzabcd***.onion",
    title: "Mixer Service Delta",
    category: "mixer",
    lastCrawled: "2024-02-06T18:14:55Z",
    addressesFound: 17,
    status: "active",
  },
];

const DarkwebDashboard = () => {
  const [statistics, setStatistics] = useState(statisticsData);
  const [recentAddresses, setRecentAddresses] = useState(recentAddressesData);
  const [recentSites, setRecentSites] = useState(recentSitesData);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month");
  const [addressType, setAddressType] = useState("all");

  // In a real application, you would fetch data from the API here
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);
    };

    fetchData();
  }, [timeRange, addressType]);

  // Colors for charts
  const categoryColors = {
    marketplace: "#3B82F6", // blue
    drugs: "#10B981", // green
    weapons: "#EF4444", // red
    fraud: "#F59E0B", // amber
    hacking: "#8B5CF6", // purple
    forum: "#6B7280", // gray
    mixer: "#EC4899", // pink
    other: "#9CA3AF", // gray
  };

  const cryptoColors = {
    bitcoin: "#F7931A", // bitcoin orange
    ethereum: "#627EEA", // ethereum blue
    solana: "#FF6600", // solana orange
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Skull className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-lg font-semibold text-gray-900">
              Darkweb Monitoring
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search address or site..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
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
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Types</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="solana">solana</option>
              </select>
            </div>
            <button className="mt-6 bg-purple-600 text-white rounded-md px-4 py-2 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
          {isLoading && (
            <div className="flex items-center text-purple-600">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading data...
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Darkweb Sites
                </h3>
                <p className="text-2xl font-bold">
                  {statistics.totalSites.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Crypto Addresses
                </h3>
                <p className="text-2xl font-bold">
                  {statistics.totalAddresses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Categories
                </h3>
                <p className="text-2xl font-bold">
                  {statistics.sitesByCategory.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Last Updated
                </h3>
                <p className="text-md font-medium">Today, 2:45 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Addresses by Type Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Addresses by Cryptocurrency
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.addressesByType}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    dataKey="count"
                    nameKey="_id"
                  >
                    {statistics.addressesByType.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={cryptoColors[entry._id] || "#9CA3AF"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Addresses"]}
                    labelFormatter={(index) =>
                      statistics.addressesByType[index]._id
                        .charAt(0)
                        .toUpperCase() +
                      statistics.addressesByType[index]._id.slice(1)
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sites by Category Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Sites by Category
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics.sitesByCategory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Sites"]} />
                  <Bar dataKey="count" name="Sites">
                    {statistics.sitesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[entry._id] || "#9CA3AF"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Addresses by Category Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Addresses by Site Category
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics.addressesByCategory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Addresses"]} />
                  <Bar dataKey="count" name="Addresses">
                    {statistics.addressesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={categoryColors[entry._id] || "#9CA3AF"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crawl History Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Crawl Discovery History
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statistics.crawlHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newSites"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="New Sites"
                  />
                  <Line
                    type="monotone"
                    dataKey="newAddresses"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="New Addresses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Addresses Table */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Recently Discovered Addresses
            </h2>
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAddresses.map((address, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                      {`${address.address.substring(
                        0,
                        10
                      )}...${address.address.substring(
                        address.address.length - 4
                      )}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          address.type === "bitcoin"
                            ? "bg-amber-100 text-amber-800"
                            : address.type === "ethereum"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {address.type.charAt(0).toUpperCase() +
                          address.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          address.category === "marketplace"
                            ? "bg-blue-100 text-blue-800"
                            : address.category === "drugs"
                            ? "bg-green-100 text-green-800"
                            : address.category === "weapons"
                            ? "bg-red-100 text-red-800"
                            : address.category === "fraud"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {address.category.charAt(0).toUpperCase() +
                          address.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(address.firstSeen).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.siteCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              address.confidence > 0.8
                                ? "bg-green-600"
                                : address.confidence > 0.5
                                ? "bg-yellow-400"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${address.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600">
                          {Math.round(address.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">5</span> of{" "}
              <span className="font-medium">142</span> addresses
            </p>
            <div>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                Previous
              </button>
              <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium ml-2">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Recent Sites Table */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Recently Crawled Sites
            </h2>
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Crawled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Addresses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSites.map((site, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                      {site.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {site.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          site.category === "marketplace"
                            ? "bg-blue-100 text-blue-800"
                            : site.category === "hacking"
                            ? "bg-purple-100 text-purple-800"
                            : site.category === "weapons"
                            ? "bg-red-100 text-red-800"
                            : site.category === "fraud"
                            ? "bg-amber-100 text-amber-800"
                            : site.category === "mixer"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {site.category.charAt(0).toUpperCase() +
                          site.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(site.lastCrawled).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.addressesFound}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">5</span> of{" "}
              <span className="font-medium">{statistics.totalSites}</span> sites
            </p>
            <div>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                Previous
              </button>
              <button className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium ml-2">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="text-center text-sm text-gray-500">
          © 2025 Blockchain Analytics Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DarkwebDashboard;
