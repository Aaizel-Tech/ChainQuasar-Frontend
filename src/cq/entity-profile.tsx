import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Layers,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Shield,
  Eye,
  Copy,
  ChevronDown,
  Search,
  Globe,
  MapPin,
  Tag,
  Info,
} from "lucide-react";
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

// Sample entity data - in a real application, this would come from your API
const entityData = {
  id: "ent123",
  name: "Exchange Alpha",
  category: "exchange",
  description: "Major global cryptocurrency exchange based in Asia",
  firstSeen: "2018-03-15T10:23:14Z",
  lastSeen: "2024-02-07T14:45:22Z",
  tags: [
    { name: "exchange", category: "service", confidence: 0.98 },
    { name: "high_volume", category: "activity", confidence: 0.95 },
    { name: "regulated", category: "regulatory", confidence: 0.85 },
  ],
  addresses: {
    total: 342,
    byChain: {
      bitcoin: 187,
      ethereum: 155,
    },
    sample: [
      {
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        chain: "bitcoin",
        balance: "345.78 BTC",
        txCount: 2145,
      },
      {
        address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        chain: "ethereum",
        balance: "2,389.45 ETH",
        txCount: 1875,
      },
      {
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        chain: "bitcoin",
        balance: "89.34 BTC",
        txCount: 967,
      },
    ],
  },
  riskScore: 0.15,
  riskCategory: "low",
  activityMetrics: {
    totalVolume: {
      btc: 12534.87,
      eth: 98765.32,
    },
    dailyAverage: {
      btc: 45.67,
      eth: 348.92,
    },
    volumeHistory: [
      { date: "2024-01-01", btc: 32.5, eth: 287.4 },
      { date: "2024-01-08", btc: 41.2, eth: 312.7 },
      { date: "2024-01-15", btc: 37.8, eth: 298.3 },
      { date: "2024-01-22", btc: 52.4, eth: 376.5 },
      { date: "2024-01-29", btc: 58.9, eth: 421.8 },
      { date: "2024-02-05", btc: 51.2, eth: 396.2 },
    ],
  },
  relatedEntities: [
    {
      id: "ent456",
      name: "Merchant Beta",
      category: "merchant",
      relationshipStrength: 0.67,
    },
    {
      id: "ent789",
      name: "Mining Pool Delta",
      category: "mining",
      relationshipStrength: 0.42,
    },
    {
      id: "ent987",
      name: "Custody Service Gamma",
      category: "service",
      relationshipStrength: 0.58,
    },
  ],
  geographicInfo: {
    country: "Singapore",
    region: "Asia-Pacific",
    regulatoryStatus: "Licensed",
  },
  contactInfo: {
    website: "https://exchange-alpha.com",
    email: "support@exchange-alpha.com",
  },
};

const EntityProfile = () => {
  const [entity, setEntity] = useState(entityData);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    addresses: true,
    activity: true,
    related: true,
    info: true,
  });

  // Function to toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Function to determine risk class
  const getRiskClass = (score) => {
    if (score >= 0.8) return "text-red-600 bg-red-50";
    if (score >= 0.5) return "text-orange-600 bg-orange-50";
    if (score >= 0.2) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  // Function to determine entity category class
  const getCategoryClass = (category) => {
    const categories = {
      exchange: "bg-blue-100 text-blue-800",
      mixer: "bg-red-100 text-red-800",
      darknet: "bg-purple-100 text-purple-800",
      gambling: "bg-orange-100 text-orange-800",
      merchant: "bg-green-100 text-green-800",
      service: "bg-indigo-100 text-indigo-800",
      mining: "bg-yellow-100 text-yellow-800",
      unknown: "bg-gray-100 text-gray-800",
    };
    return categories[category] || categories.unknown;
  };

  // Data for the blockchain distribution pie chart
  const chainDistributionData = [
    {
      name: "Bitcoin",
      value: entity.addresses.byChain.bitcoin,
      color: "#F7931A",
    },
    {
      name: "Ethereum",
      value: entity.addresses.byChain.ethereum,
      color: "#627EEA",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Entity Profile
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="w-full mx-auto">
            {/* Entity Overview */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {entity.name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryClass(
                        entity.category
                      )}`}
                    >
                      {entity.category.charAt(0).toUpperCase() +
                        entity.category.slice(1)}
                    </span>
                    <p className="text-sm font-medium ml-2 text-gray-500">
                      ID: {entity.id}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskClass(
                      entity.riskScore
                    )}`}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {entity.riskCategory.charAt(0).toUpperCase() +
                      entity.riskCategory.slice(1)}{" "}
                    Risk
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">{entity.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">Total Addresses</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {entity.addresses.total}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">BTC Volume</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {entity.activityMetrics.totalVolume.btc.toLocaleString()}{" "}
                    BTC
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">ETH Volume</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {entity.activityMetrics.totalVolume.eth.toLocaleString()}{" "}
                    ETH
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">First/Last Seen</p>
                  </div>
                  <p className="text-xs font-medium text-gray-800">
                    {new Date(entity.firstSeen).toLocaleDateString()} -{" "}
                    {new Date(entity.lastSeen).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {entity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      title={`Confidence: ${Math.round(tag.confidence * 100)}%`}
                    >
                      {tag.name.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Address Distribution
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chainDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          dataKey="value"
                          label={({ name, value, percent }) =>
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          }
                        >
                          {chainDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} addresses`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Geographic Information
                  </p>
                  <div className="p-4 bg-gray-50 rounded-lg h-64 flex flex-col justify-center">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-800">
                          {entity.geographicInfo.country},{" "}
                          {entity.geographicInfo.region}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">
                          Regulatory Status
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {entity.geographicInfo.regulatoryStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <a
                          href={entity.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {entity.contactInfo.website.replace("https://", "")}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <a
                          href={`mailto:${entity.contactInfo.email}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {entity.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address List */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left"
                onClick={() => toggleSection("addresses")}
              >
                <div className="flex items-center">
                  <Layers className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Associated Addresses
                  </h3>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {entity.addresses.total}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    expandedSections.addresses ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.addresses && (
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-700">
                      Showing {entity.addresses.sample.length} of{" "}
                      {entity.addresses.total} addresses
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search addresses..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Chain
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transactions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {entity.addresses.sample.map((addr, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer mr-2">
                                  {`${addr.address.substring(
                                    0,
                                    8
                                  )}...${addr.address.substring(
                                    addr.address.length - 6
                                  )}`}
                                </p>
                                <button
                                  onClick={() => copyToClipboard(addr.address)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                  addr.chain === "bitcoin"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {addr.chain.charAt(0).toUpperCase() +
                                  addr.chain.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {addr.balance}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {addr.txCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                View
                              </a>
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Analyze
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Addresses
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Metrics */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left"
                onClick={() => toggleSection("activity")}
              >
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Activity Metrics
                  </h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    expandedSections.activity ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.activity && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Daily Average Volume
                      </h4>
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Bitcoin:
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {entity.activityMetrics.dailyAverage.btc} BTC
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Ethereum:
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {entity.activityMetrics.dailyAverage.eth} ETH
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Total Volume
                      </h4>
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Bitcoin:
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {entity.activityMetrics.totalVolume.btc.toLocaleString()}{" "}
                            BTC
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Ethereum:
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {entity.activityMetrics.totalVolume.eth.toLocaleString()}{" "}
                            ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Activity Over Time
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={entity.activityMetrics.volumeHistory}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#F7931A"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#627EEA"
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="btc"
                          name="Bitcoin (BTC)"
                          stroke="#F7931A"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="eth"
                          name="Ethereum (ETH)"
                          stroke="#627EEA"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Related Entities */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left"
                onClick={() => toggleSection("related")}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Related Entities
                  </h3>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {entity.relatedEntities.length}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    expandedSections.related ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.related && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Entities that have transactional relationships with{" "}
                    {entity.name}.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entity.relatedEntities.map((related, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-800">
                            {related.name}
                          </h4>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryClass(
                              related.category
                            )}`}
                          >
                            {related.category.charAt(0).toUpperCase() +
                              related.category.slice(1)}
                          </span>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              Relationship Strength
                            </span>
                            <span className="text-gray-700">
                              {Math.round(related.relationshipStrength * 100)}%
                            </span>
                          </div>
                          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${Math.round(
                                  related.relationshipStrength * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Entity
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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

// Missing Mail icon component
const Mail = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

// Missing Activity icon component
const Activity = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

export default EntityProfile;
