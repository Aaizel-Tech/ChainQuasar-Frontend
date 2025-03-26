import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Clock,
  Tag,
  Shield,
  Skull,
  Globe,
  Eye,
  Copy,
  Info,
  X,
  Check,
  HelpCircle,
} from "lucide-react";

// Sample data - in a real implementation, this would come from your API
const addressData = {
  address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  chainId: "bitcoin",
  firstSeen: "2023-11-15T10:23:14Z",
  lastSeen: "2024-02-06T18:45:22Z",
  balance: "12.34567890 BTC",
  totalReceived: "45.78901234 BTC",
  totalSent: "33.44333344 BTC",
  txCount: 128,
  entity: {
    id: "ent789",
    name: "Exchange Gamma",
    category: "exchange",
    description: "Major cryptocurrency exchange",
    riskScore: 0.15,
  },
  tags: [
    { name: "exchange_hot_wallet", category: "service", confidence: 0.9 },
    { name: "high_volume", category: "activity", confidence: 0.85 },
  ],
  riskScore: 0.82,
  riskCategory: "high",
  riskIndicators: [
    {
      type: "darknet_market",
      category: "high",
      description: "Address associated with darkweb marketplace",
      confidence: 0.87,
      source: "darkweb_monitor",
      timestamp: "2024-02-05T14:23:45Z",
      evidence: {
        sites: [
          {
            url: "http://abcdef***.onion",
            title: "Dark Market Alpha",
            category: "marketplace",
          },
          {
            url: "http://ghijkl***.onion",
            title: "Black Market V2",
            category: "marketplace",
          },
        ],
      },
    },
    {
      type: "mixer",
      category: "medium",
      description: "Transaction to known mixing service",
      confidence: 0.75,
      source: "transaction_analysis",
      timestamp: "2024-01-18T09:11:22Z",
    },
    {
      type: "unusual_pattern",
      category: "medium",
      description: "Unusual transaction pattern detected",
      confidence: 0.65,
      source: "pattern_analysis",
      timestamp: "2024-01-12T16:42:18Z",
    },
  ],
  darkwebIntelligence: {
    found: true,
    firstSeen: "2024-02-05T14:23:45Z",
    lastSeen: "2024-02-06T18:45:22Z",
    siteCount: 3,
    confidence: 0.87,
    sites: [
      {
        url: "http://abcdef***.onion",
        title: "Dark Market Alpha",
        category: "marketplace",
        firstSeen: "2024-02-05T14:23:45Z",
        lastSeen: "2024-02-06T18:45:22Z",
      },
      {
        url: "http://ghijkl***.onion",
        title: "Black Market V2",
        category: "marketplace",
        firstSeen: "2024-02-05T14:23:45Z",
        lastSeen: "2024-02-05T14:23:45Z",
      },
      {
        url: "http://mnopqr***.onion",
        title: "Weapons Exchange",
        category: "weapons",
        firstSeen: "2024-02-06T18:45:22Z",
        lastSeen: "2024-02-06T18:45:22Z",
      },
    ],
    categories: [
      { category: "marketplace", count: 2 },
      { category: "weapons", count: 1 },
    ],
  },
};

const AddressRiskView = () => {
  const [address, setAddress] = useState(addressData);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    darkweb: true,
    riskIndicators: true,
    details: true,
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

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to determine risk class
  const getRiskClass = (score) => {
    if (score >= 0.8) return "text-red-600 bg-red-50";
    if (score >= 0.5) return "text-orange-600 bg-orange-50";
    if (score >= 0.2) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  // Function to determine category class
  const getCategoryClass = (category) => {
    const categories = {
      marketplace: "bg-blue-100 text-blue-800",
      drugs: "bg-green-100 text-green-800",
      weapons: "bg-red-100 text-red-800",
      fraud: "bg-amber-100 text-amber-800",
      hacking: "bg-purple-100 text-purple-800",
      exchange: "bg-indigo-100 text-indigo-800",
      mixer: "bg-pink-100 text-pink-800",
      gambling: "bg-orange-100 text-orange-800",
      unknown: "bg-gray-100 text-gray-800",
    };
    return categories[category] || categories.unknown;
  };

  // Function to get a risk indicator icon
  const getRiskIcon = (type: any) => {
    switch (type) {
      case "darknet_market":
        return <Skull className="h-5 w-5 text-red-500" />;
      case "mixer":
        return <Shield className="h-5 w-5 text-orange-500" />;
      case "unusual_pattern":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Address Risk Assessment
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
          <div className="max-w-4xl mx-auto">
            {/* Risk Summary */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Risk Assessment
                  </h2>
                  <div className="flex items-center mt-1">
                    <p className="text-sm font-medium text-gray-500 mr-2">
                      {address.chainId === "ethereum" ? "Ethereum" : "Bitcoin"}
                    </p>
                    <p className="text-sm font-medium mr-2">•</p>
                    <p className="text-sm font-medium text-gray-500">
                      {address.entity?.name || "Unknown Entity"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center space-x-2">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskClass(
                      address.riskScore
                    )}`}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {address.riskCategory.charAt(0).toUpperCase() +
                      address.riskCategory.slice(1)}{" "}
                    Risk
                  </div>
                  {address.darkwebIntelligence.found && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <Skull className="h-4 w-4 mr-1" />
                      Darkweb Presence
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg mb-4 break-all">
                <div className="flex items-center">
                  <p className="text-gray-800 font-mono text-sm mr-2">
                    {address.address}
                  </p>
                  <button
                    onClick={() => copyToClipboard(address.address)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  This address has been flagged with{" "}
                  <span className="font-medium">
                    {address.riskIndicators.length} risk indicators
                  </span>
                  , including presence on darkweb sites. The overall risk score
                  is{" "}
                  <span className="font-medium">
                    {address.riskScore.toFixed(2)}
                  </span>
                  .
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      address.riskScore >= 0.8
                        ? "bg-red-600"
                        : address.riskScore >= 0.5
                        ? "bg-orange-500"
                        : address.riskScore >= 0.2
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${address.riskScore * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Low Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {address.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    title={`Confidence: ${Math.round(tag.confidence * 100)}%`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Darkweb Intelligence */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left border-b border-gray-200"
                onClick={() => toggleSection("darkweb")}
              >
                <div className="flex items-center">
                  <Skull className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Darkweb Intelligence
                  </h3>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Found on {address.darkwebIntelligence.siteCount} sites
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    expandedSections.darkweb ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.darkweb && (
                <div className="px-6 py-4">
                  <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <div className="text-sm text-gray-500 mb-1">
                        First Detected
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(address.darkwebIntelligence.firstSeen)}
                      </div>
                    </div>

                    <div className="mb-4 md:mb-0">
                      <div className="text-sm text-gray-500 mb-1">
                        Last Detected
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(address.darkwebIntelligence.lastSeen)}
                      </div>
                    </div>

                    <div className="mb-4 md:mb-0">
                      <div className="text-sm text-gray-500 mb-1">
                        Number of Sites
                      </div>
                      <div className="text-sm font-medium">
                        {address.darkwebIntelligence.siteCount}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Confidence
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              address.darkwebIntelligence.confidence > 0.8
                                ? "bg-red-600"
                                : address.darkwebIntelligence.confidence > 0.5
                                ? "bg-orange-500"
                                : "bg-yellow-400"
                            }`}
                            style={{
                              width: `${
                                address.darkwebIntelligence.confidence * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600">
                          {Math.round(
                            address.darkwebIntelligence.confidence * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Site Categories
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {address.darkwebIntelligence.categories.map(
                        (category, index) => (
                          <div key={index} className="flex items-center">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryClass(
                                category.category
                              )}`}
                            >
                              {category.category.charAt(0).toUpperCase() +
                                category.category.slice(1)}
                            </span>
                            <span className="ml-1 text-xs font-medium text-gray-500">
                              ({category.count})
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Detected on the following darkweb sites:
                  </h4>
                  <div className="space-y-3">
                    {address.darkwebIntelligence.sites.map((site, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              <Globe className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-800">
                                {site.url}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {site.title}
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getCategoryClass(
                                  site.category
                                )}`}
                              >
                                {site.category.charAt(0).toUpperCase() +
                                  site.category.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-right text-gray-500">
                            <div>First Seen: {formatDate(site.firstSeen)}</div>
                            <div>Last Seen: {formatDate(site.lastSeen)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg flex items-start">
                    <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Note:</strong> For security and legal reasons,
                      full onion URLs are obfuscated. The darkweb intelligence
                      is used to assess risk but direct access to these sites is
                      restricted to authorized personnel only.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Indicators */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left border-b border-gray-200"
                onClick={() => toggleSection("riskIndicators")}
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Risk Indicators
                  </h3>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {address.riskIndicators.length} Indicators
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    expandedSections.riskIndicators
                      ? "transform rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expandedSections.riskIndicators && (
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {address.riskIndicators.map((indicator, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div
                          className={`px-4 py-3 flex items-center justify-between ${
                            indicator.category === "high"
                              ? "bg-red-50"
                              : indicator.category === "medium"
                              ? "bg-orange-50"
                              : "bg-yellow-50"
                          }`}
                        >
                          <div className="flex items-center">
                            {getRiskIcon(indicator.type)}
                            <h4 className="ml-2 text-sm font-medium text-gray-800">
                              {indicator.type
                                .replace(/_/g, " ")
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </h4>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              Source: {indicator.source}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                                indicator.category === "high"
                                  ? "bg-red-100 text-red-800"
                                  : indicator.category === "medium"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {indicator.category.charAt(0).toUpperCase() +
                                indicator.category.slice(1)}{" "}
                              Risk
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-700 mb-2">
                            {indicator.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">
                                Confidence:
                              </span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    indicator.confidence > 0.8
                                      ? "bg-red-600"
                                      : indicator.confidence > 0.5
                                      ? "bg-orange-500"
                                      : "bg-yellow-400"
                                  }`}
                                  style={{
                                    width: `${indicator.confidence * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs font-medium text-gray-600">
                                {Math.round(indicator.confidence * 100)}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatDate(indicator.timestamp)}
                            </div>
                          </div>

                          {indicator.evidence && indicator.evidence.sites && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-2">
                                Evidence:
                              </p>
                              <div className="space-y-1">
                                {indicator.evidence.sites.map(
                                  (site, siteIndex) => (
                                    <div
                                      key={siteIndex}
                                      className="flex items-center text-xs"
                                    >
                                      <span
                                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                          getCategoryClass(site.category).split(
                                            " "
                                          )[0]
                                        }`}
                                      ></span>
                                      <span className="text-gray-800 mr-1">
                                        {site.title}
                                      </span>
                                      <span className="text-gray-500">
                                        ({site.url})
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left border-b border-gray-200"
                onClick={() => toggleSection("details")}
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Address Details
                  </h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    expandedSections.details ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.details && (
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Balance</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {address.balance}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Transaction Count
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {address.txCount}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Total Received
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {address.totalReceived}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Total Sent</p>
                      <p className="text-lg font-semibold text-red-600">
                        {address.totalSent}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      First/Last Seen On Blockchain
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(address.firstSeen)}
                      </p>
                      <button className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(address.lastSeen)}
                      </p>
                    </div>
                  </div>

                  {address.entity && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Entity Information
                        </h4>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getCategoryClass(
                            address.entity.category
                          )}`}
                        >
                          {address.entity.category.charAt(0).toUpperCase() +
                            address.entity.category.slice(1)}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-gray-800 mb-1">
                        {address.entity.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {address.entity.description}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          Entity Risk:
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              address.entity.riskScore > 0.8
                                ? "bg-red-600"
                                : address.entity.riskScore > 0.5
                                ? "bg-orange-500"
                                : address.entity.riskScore > 0.2
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${address.entity.riskScore * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600">
                          {Math.round(address.entity.riskScore * 100)}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Transaction History
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recommendations
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-red-100 p-1 rounded-full mt-0.5">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    <strong>High Risk:</strong> Avoid transactions with this
                    address due to its association with darkweb marketplaces.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="bg-amber-100 p-1 rounded-full mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    <strong>File SAR:</strong> Consider filing a Suspicious
                    Activity Report if your organization is subject to AML
                    regulations.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    <strong>Monitor:</strong> Add this address to your
                    monitoring system for ongoing surveillance.
                  </p>
                </div>
              </div>
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
export default AddressRiskView;

{
  /*// Arrow Right component
const ArrowRight = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    */
}
