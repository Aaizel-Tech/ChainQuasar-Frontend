import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AddressExplorer = () => {
  const [addressData, setAddressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    transactions: true,
    connected: true,
    entity: true,
  });
  const [transactionSortConfig, setTransactionSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });

  // Function to fetch and process CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/public/abc.csv");
        const text = await response.text();

        // Process CSV data
        const rows = text.split("\n");
        const headers = rows[0].split(",");

        // Process transactions
        const transactions = rows
          .slice(1)
          .filter((row) => row.trim() !== "")
          .map((row) => {
            const values = row.split(",");
            const rowData = {};

            headers.forEach((header, index) => {
              rowData[header] = values[index];
            });

            return rowData;
          });

        // Get unique addresses and their risk levels
        const addresses = new Map();
        transactions.forEach((tx) => {
          if (tx.sender_address && !addresses.has(tx.sender_address)) {
            addresses.set(tx.sender_address, {
              address: tx.sender_address,
              riskCategory: getRiskCategory(tx),
              riskScore: calculateRiskScore(tx),
              txCount: 0,
              totalSent: 0,
              totalReceived: 0,
            });
          }

          if (tx.receiver_address && !addresses.has(tx.receiver_address)) {
            addresses.set(tx.receiver_address, {
              address: tx.receiver_address,
              riskCategory: getRiskCategory(tx),
              riskScore: calculateRiskScore(tx),
              txCount: 0,
              totalSent: 0,
              totalReceived: 0,
            });
          }

          // Update transaction counts
          if (tx.sender_address) {
            const addr = addresses.get(tx.sender_address);
            addr.txCount = (addr.txCount || 0) + 1;
            addr.totalSent = (addr.totalSent || 0) + parseFloat(tx.value || 0);
          }

          if (tx.receiver_address) {
            const addr = addresses.get(tx.receiver_address);
            addr.txCount = (addr.txCount || 0) + 1;
            addr.totalReceived =
              (addr.totalReceived || 0) + parseFloat(tx.value || 0);
          }
        });

        // Select the first address with highest transaction count as the primary address
        let primaryAddress = null;
        let maxTxCount = 0;
        addresses.forEach((addr) => {
          if (addr.txCount > maxTxCount) {
            maxTxCount = addr.txCount;
            primaryAddress = addr;
          }
        });

        if (primaryAddress) {
          // Process transactions for this address
          const addressTransactions = transactions.filter(
            (tx) =>
              tx.sender_address === primaryAddress.address ||
              tx.receiver_address === primaryAddress.address
          );

          // Get connected addresses
          const connectedAddrs = new Set();
          addressTransactions.forEach((tx) => {
            if (tx.sender_address === primaryAddress.address) {
              connectedAddrs.add(tx.receiver_address);
            } else if (tx.receiver_address === primaryAddress.address) {
              connectedAddrs.add(tx.sender_address);
            }
          });

          const connectedAddresses = Array.from(connectedAddrs).map((addr) => {
            const connAddr = addresses.get(addr);
            return {
              address: addr,
              txCount: connAddr?.txCount || 0,
              lastSeen: new Date().toISOString(), // Assuming current date as we don't have timestamp in CSV
              entity: getEntityInfo(addr, transactions),
            };
          });

          // Process recent transactions
          const recentTransactions = addressTransactions
            .slice(0, 10)
            .map((tx) => {
              return {
                txid: tx.tx_hash || "unknown",
                timestamp: new Date().toISOString(), // Assuming current date
                direction:
                  tx.sender_address === primaryAddress.address
                    ? "outbound"
                    : "inbound",
                value: `${parseFloat(tx.value || 0)} BTC`,
                confirmations: Math.floor(Math.random() * 500), // Random confirmation count
                sender: {
                  address: tx.sender_address,
                  entity: getEntityInfo(tx.sender_address, transactions),
                },
                recipient: {
                  address: tx.receiver_address,
                  entity: getEntityInfo(tx.receiver_address, transactions),
                },
              };
            });

          // Generate transaction history (dummy data as we don't have time series)
          const transactionHistory = generateTransactionHistory();

          // Calculate balance
          const balance =
            (primaryAddress.totalReceived || 0) -
            (primaryAddress.totalSent || 0);

          // Tags based on risk and transaction patterns
          const tags = generateTags(primaryAddress, transactions);

          setAddressData({
            address: primaryAddress.address,
            chainId: "bitcoin",
            firstSeen: new Date(
              new Date().setMonth(new Date().getMonth() - 3)
            ).toISOString(),
            lastSeen: new Date().toISOString(),
            balance: `${balance.toFixed(8)} BTC`,
            totalReceived: `${
              primaryAddress.totalReceived?.toFixed(8) || 0
            } BTC`,
            totalSent: `${primaryAddress.totalSent?.toFixed(8) || 0} BTC`,
            txCount: primaryAddress.txCount || 0,
            entity: getEntityInfo(primaryAddress.address, transactions),
            tags,
            riskScore: primaryAddress.riskScore || 0,
            riskCategory: primaryAddress.riskCategory || "low",
            riskIndicators: [],
            transactionHistory,
            recentTransactions,
            connectedAddresses,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to determine risk category based on flags in data
  function getRiskCategory(transaction) {
    if (transaction.High_Risk === "1") return "high";
    if (transaction.Medium_Risk === "1") return "medium";
    if (transaction.Low_Risk === "1") return "low";
    return "low"; // Default
  }

  // Function to calculate risk score
  function calculateRiskScore(transaction) {
    if (transaction.High_Risk === "1") return 0.85;
    if (transaction.Medium_Risk === "1") return 0.5;
    if (transaction.Low_Risk === "1") return 0.15;
    if (transaction.fraud_probability)
      return parseFloat(transaction.fraud_probability);
    return 0.1; // Default low risk
  }

  // Function to generate entity info based on address patterns
  function getEntityInfo(address, transactions) {
    if (!address) return null;

    // Check for high out degree nodes (might be exchanges)
    const isHighOutDegree = transactions.some(
      (tx) => tx.sender_address === address && tx.high_out_degree === "1"
    );

    if (isHighOutDegree) {
      return {
        name: "Possible Exchange",
        category: "exchange",
      };
    }

    // Check for repeat receiver (might be merchant or service)
    const isRepeatReceiver = transactions.some(
      (tx) => tx.receiver_address === address && tx.repeat_receiver_tx === "1"
    );

    if (isRepeatReceiver) {
      return {
        name: "Merchant Service",
        category: "merchant",
      };
    }

    // Check high risk addresses
    const isHighRisk = transactions.some(
      (tx) =>
        (tx.sender_address === address || tx.receiver_address === address) &&
        tx.High_Risk === "1"
    );

    if (isHighRisk) {
      return {
        name: "High Risk Entity",
        category: "unknown",
      };
    }

    return null;
  }

  // Function to generate tags based on data patterns
  function generateTags(address, transactions) {
    const tags = [];

    if (address.txCount > 50) {
      tags.push({
        name: "high_volume",
        category: "activity",
        confidence: 0.9,
      });
    }

    const highValueTxs = transactions.some(
      (tx) =>
        (tx.sender_address === address.address ||
          tx.receiver_address === address.address) &&
        tx.high_value_tx === "1"
    );

    if (highValueTxs) {
      tags.push({
        name: "high_value_transactions",
        category: "activity",
        confidence: 0.85,
      });
    }

    if (address.riskCategory === "high") {
      tags.push({
        name: "high_risk_activity",
        category: "risk",
        confidence: 0.95,
      });
    }

    return tags;
  }

  // Function to generate dummy transaction history
  function generateTransactionHistory() {
    const history = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i * 7);

      history.push({
        date: date.toISOString().split("T")[0],
        inflow: Math.random() * 3 + 0.5,
        outflow: Math.random() * 2.5 + 0.3,
      });
    }

    return history;
  }

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

  // Function to determine entity category class
  const getCategoryClass = (category) => {
    if (!category) return "bg-gray-100 text-gray-800";

    const categories = {
      exchange: "bg-blue-100 text-blue-800",
      mixer: "bg-red-100 text-red-800",
      darknet: "bg-purple-100 text-purple-800",
      gambling: "bg-orange-100 text-orange-800",
      merchant: "bg-green-100 text-green-800",
      service: "bg-indigo-100 text-indigo-800",
      unknown: "bg-gray-100 text-gray-800",
    };
    return categories[category] || categories.unknown;
  };

  // Function to handle transaction sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (
      transactionSortConfig.key === key &&
      transactionSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setTransactionSortConfig({ key, direction });
  };

  // Sort transactions based on current sort configuration
  const sortedTransactions = addressData?.recentTransactions
    ? [...addressData.recentTransactions].sort((a, b) => {
        if (a[transactionSortConfig.key] < b[transactionSortConfig.key]) {
          return transactionSortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[transactionSortConfig.key] > b[transactionSortConfig.key]) {
          return transactionSortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col max-h-screen w-full bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Address Explorer
            </h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!addressData) {
    return (
      <div className="flex flex-col max-h-screen w-full bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Address Explorer
            </h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No Data Available
            </h2>
            <p>Unable to load address data from the CSV file.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Address Explorer
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="w-full mx-auto">
          {/* Address Overview */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Address Details
                </h2>
                <div className="flex items-center mt-1">
                  <p className="text-sm font-medium text-gray-500 mr-2">
                    Bitcoin
                  </p>
                  <p className="text-sm font-medium mr-2">•</p>
                  <p className="text-sm font-medium text-gray-500">
                    {addressData.txCount} transactions
                  </p>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskClass(
                    addressData.riskScore
                  )}`}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {addressData.riskCategory.charAt(0).toUpperCase() +
                    addressData.riskCategory.slice(1)}{" "}
                  Risk
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg mb-4 break-all">
              <div className="flex items-center">
                <p className="text-gray-800 font-mono text-sm mr-2">
                  {addressData.address}
                </p>
                <button
                  onClick={() => copyToClipboard(addressData.address)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {addressData.entity && (
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm font-medium text-gray-700">
                    Identified Entity
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-2 py-1 text-sm font-medium rounded ${getCategoryClass(
                      addressData.entity.category
                    )}`}
                  >
                    {addressData.entity.name}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-lg font-semibold text-gray-800">
                  {addressData.balance}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Received</p>
                <p className="text-lg font-semibold text-green-600">
                  {addressData.totalReceived}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Sent</p>
                <p className="text-lg font-semibold text-red-600">
                  {addressData.totalSent}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">First/Last Seen</p>
                <p className="text-xs font-medium text-gray-800">
                  {new Date(addressData.firstSeen).toLocaleDateString()} -{" "}
                  {new Date(addressData.lastSeen).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {addressData.tags.map((tag, index) => (
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

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Transaction Flow
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={addressData.transactionHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inflow" name="Inflow" fill="#10B981" />
                    <Bar dataKey="outflow" name="Outflow" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-6 py-4 text-left"
              onClick={() => toggleSection("transactions")}
            >
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Transactions
                </h3>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  expandedSections.transactions ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.transactions && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("timestamp")}
                      >
                        <div className="flex items-center">
                          <span>Time</span>
                          {transactionSortConfig.key === "timestamp" &&
                            (transactionSortConfig.direction === "asc" ? (
                              <ArrowUp className="ml-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="ml-1 h-3 w-3" />
                            ))}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Counter Party
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTransactions.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tx.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.direction === "inbound"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tx.direction === "inbound" ? (
                              <>
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                Received
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                Sent
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tx.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex items-center">
                              <a
                                href="#"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {tx.direction === "inbound"
                                  ? `${tx.sender.address.substring(
                                      0,
                                      6
                                    )}...${tx.sender.address.substring(
                                      tx.sender.address.length - 4
                                    )}`
                                  : `${tx.recipient.address.substring(
                                      0,
                                      6
                                    )}...${tx.recipient.address.substring(
                                      tx.recipient.address.length - 4
                                    )}`}
                              </a>
                            </div>
                            {tx.direction === "inbound" && tx.sender.entity && (
                              <span
                                className={`inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded ${getCategoryClass(
                                  tx.sender.entity.category
                                )}`}
                              >
                                {tx.sender.entity.name}
                              </span>
                            )}
                            {tx.direction === "outbound" &&
                              tx.recipient.entity && (
                                <span
                                  className={`inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded ${getCategoryClass(
                                    tx.recipient.entity.category
                                  )}`}
                                >
                                  {tx.recipient.entity.name}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href="#" className="text-blue-600 hover:underline">
                            {`${tx.txid.substring(0, 6)}...${tx.txid.substring(
                              tx.txid.length - 4
                            )}`}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Transactions
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Connected Addresses */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-6 py-4 text-left"
              onClick={() => toggleSection("connected")}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Connected Addresses
                </h3>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  expandedSections.connected ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.connected && (
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-600 mb-4">
                  These addresses have direct transaction relationships with the
                  current address.
                </p>

                <div className="space-y-3">
                  {addressData.connectedAddresses.map((addr, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <a
                              href="#"
                              className="text-sm font-medium text-blue-600 hover:underline mr-2"
                            >
                              {addr.address}
                            </a>
                            <button
                              onClick={() => copyToClipboard(addr.address)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>

                          {addr.entity && (
                            <span
                              className={`inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded ${getCategoryClass(
                                addr.entity.category
                              )}`}
                            >
                              {addr.entity.name}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          <div>{addr.txCount} transactions</div>
                          <div>
                            Last seen{" "}
                            {new Date(addr.lastSeen).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default AddressExplorer;
