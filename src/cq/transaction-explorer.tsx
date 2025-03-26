import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Hash,
  Shield,
  Eye,
  Copy,
  ChevronDown,
} from "lucide-react";

const TransactionExplorer = () => {
  const [transactionData, setTransactionData] = useState(null);
  const [currentTxId, setCurrentTxId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highRiskTransactions, setHighRiskTransactions] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    flow: true,
    risk: true,
    related: true,
  });

  // Load CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/public/abc.csv");
        const csvText = await response.text();
        const transactions = parseCSV(csvText);

        // Sort to find high risk transactions
        const sortedByRisk = [...transactions].sort(
          (a, b) => b.High_Risk - a.High_Risk
        );
        setHighRiskTransactions(sortedByRisk.slice(0, 25));

        // Set the first transaction as current if available
        if (sortedByRisk.length > 0) {
          setCurrentTxId(sortedByRisk[0].tx_id);
          setTransactionData(formatTransactionData(sortedByRisk[0]));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading transaction data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Parse CSV function
  const parseCSV = (csvText) => {
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");

    return lines
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const values = line.split(",");
        const transaction = {};

        headers.forEach((header, index) => {
          transaction[header.trim()] = values[index]
            ? values[index].trim()
            : "";
        });

        return transaction;
      });
  };

  // Format transaction data for display
  const formatTransactionData = (transaction) => {
    // Determine risk level
    let riskLevel = "low";
    let riskScore = parseFloat(transaction.Low_Risk || 0);

    if (parseFloat(transaction.High_Risk || 0) > 0.5) {
      riskLevel = "high";
      riskScore = parseFloat(transaction.High_Risk);
    } else if (parseFloat(transaction.Medium_Risk || 0) > 0.5) {
      riskLevel = "moderate";
      riskScore = parseFloat(transaction.Medium_Risk);
    }

    // Create risk indicators
    const riskIndicators = [];
    if (transaction.high_value_tx === "1") {
      riskIndicators.push({
        type: "high_value",
        category: "medium",
        description: "High value transaction detected",
        confidence: 0.8,
      });
    }

    if (transaction.repeat_receiver_tx === "1") {
      riskIndicators.push({
        type: "repeat_receiver",
        category: "medium",
        description: "Repeated transactions to same receiver",
        confidence: 0.75,
      });
    }

    if (transaction.high_out_degree === "1") {
      riskIndicators.push({
        type: "high_out_degree",
        category: "high",
        description: "High number of output transactions",
        confidence: 0.85,
      });
    }

    if (transaction.low_entropy_hash === "1") {
      riskIndicators.push({
        type: "low_entropy",
        category: "medium",
        description: "Low entropy transaction hash detected",
        confidence: 0.7,
      });
    }

    if (transaction.duplicate_tx_flag === "1") {
      riskIndicators.push({
        type: "duplicate",
        category: "high",
        description: "Duplicate transaction pattern detected",
        confidence: 0.9,
      });
    }

    // Define patterns
    const patterns = [];
    if (transaction.high_value_tx === "1") patterns.push("high_value");
    if (transaction.repeat_receiver_tx === "1")
      patterns.push("repeat_receiver");
    if (transaction.high_out_degree === "1") patterns.push("high_out_degree");
    if (transaction.low_entropy_hash === "1") patterns.push("low_entropy_hash");
    if (transaction.duplicate_tx_flag === "1")
      patterns.push("duplicate_transaction");

    return {
      txid: transaction.tx_id || transaction.tx_hash,
      txHash: transaction.tx_hash || transaction.tx_id,
      chainId: "bitcoin", // Assuming Bitcoin, adjust as needed
      blockHeight: Math.floor(Math.random() * 800000) + 100000, // Placeholder
      timestamp: new Date().toISOString(), // Placeholder
      confirmations: Math.floor(Math.random() * 100) + 1, // Placeholder
      fee: transaction.fee ? `${transaction.fee} BTC` : "0.0001 BTC",
      totalValue: transaction.value ? `${transaction.value} BTC` : "0 BTC",
      size: transaction.size || "Unknown",
      vsize: transaction.vsize || "Unknown",
      weight: transaction.weight || "Unknown",

      inputs: [
        {
          address: transaction.sender_address || "Unknown",
          value: transaction.value ? `${transaction.value} BTC` : "Unknown",
          entity: {
            id: transaction.sender_index || "Unknown",
            name: `Sender ${transaction.sender_index || "Unknown"}`,
            category: "unknown",
            riskScore: parseFloat(transaction.fraud_probability || 0),
          },
        },
      ],

      outputs: [
        {
          address: transaction.receiver_address || "Unknown",
          value: transaction.value ? `${transaction.value} BTC` : "Unknown",
          entity: {
            id: transaction.receiver_index || "Unknown",
            name: `Receiver ${transaction.receiver_index || "Unknown"}`,
            category: "unknown",
            riskScore: parseFloat(transaction.fraud_probability || 0),
          },
        },
      ],

      riskScore: riskScore,
      riskCategory: riskLevel,
      riskIndicators: riskIndicators,
      patterns: patterns,
      scriptPubKey: transaction.scriptPubKey_hex || "Unknown",
    };
  };

  // Function to load a specific transaction
  const loadTransaction = (txId) => {
    setIsLoading(true);

    // Find the transaction in high risk list
    const transaction = highRiskTransactions.find((tx) => tx.tx_id === txId);

    if (transaction) {
      setCurrentTxId(txId);
      setTransactionData(formatTransactionData(transaction));
    }

    setIsLoading(false);
  };

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

  // Function to determine risk label
  const getRiskLabel = (category) => {
    switch (category) {
      case "high":
        return "High Risk";
      case "moderate":
        return "Moderate Risk";
      case "low":
        return "Low Risk";
      default:
        return "Unknown Risk";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Transaction Data
          </h2>
          <p className="text-gray-600 mb-4">
            No transaction data could be loaded from the CSV file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Blockchain Transaction Explorer
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Transaction Overview */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Transaction Details
                </h2>
                <div className="flex items-center mt-1">
                  <p className="text-sm font-medium text-gray-500 mr-2">
                    {transactionData.chainId === "ethereum"
                      ? "Ethereum"
                      : "Bitcoin"}
                  </p>
                  <p className="text-sm font-medium mr-2">•</p>
                  <p className="text-sm font-medium text-gray-500">
                    {formatDate(transactionData.timestamp)}
                  </p>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskClass(
                    transactionData.riskScore
                  )}`}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {getRiskLabel(transactionData.riskCategory)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2">
              <div className="w-full sm:w-auto flex items-center mr-6 mb-2 sm:mb-0">
                <Hash className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-800 mr-2">
                      {transactionData.txid
                        ? `${transactionData.txid.substring(
                            0,
                            10
                          )}...${transactionData.txid.substring(
                            transactionData.txid.length - 8
                          )}`
                        : "Unknown"}
                    </p>
                    {transactionData.txid && (
                      <button
                        onClick={() => copyToClipboard(transactionData.txid)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center mr-6 mb-2 sm:mb-0">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-sm font-medium text-gray-800">
                    {transactionData.totalValue}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center mr-6 mb-2 sm:mb-0">
                <Eye className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Block Height</p>
                  <p className="text-sm font-medium text-gray-800">
                    #{transactionData.blockHeight}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center mr-6 mb-2 sm:mb-0">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Confirmations</p>
                  <p className="text-sm font-medium text-gray-800">
                    {transactionData.confirmations}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Fee</p>
                  <p className="text-sm font-medium text-gray-800">
                    {transactionData.fee}
                  </p>
                </div>
              </div>
            </div>

            {transactionData.patterns.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {transactionData.patterns.map((pattern, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {pattern.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Flow Visualization */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-6 py-4 text-left"
              onClick={() => toggleSection("flow")}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Transaction Flow
              </h3>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  expandedSections.flow ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.flow && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  {/* Input Side */}
                  <div className="w-full md:w-5/12">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      From
                    </h4>
                    {transactionData.inputs.map((input, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                              {input.address && input.address !== "Unknown"
                                ? `${input.address.substring(
                                    0,
                                    6
                                  )}...${input.address.substring(
                                    input.address.length - 4
                                  )}`
                                : "Unknown"}
                            </p>
                            {input.address && input.address !== "Unknown" && (
                              <button
                                onClick={() => copyToClipboard(input.address)}
                                className="text-gray-400 hover:text-gray-600 ml-1"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          {input.entity && input.entity.name && (
                            <div className="mt-1">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryClass(
                                  input.entity.category
                                )}`}
                              >
                                {input.entity.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium">{input.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center my-4 md:my-0 md:mx-6">
                    <div className="bg-blue-100 rounded-full p-2">
                      <ArrowRight className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>

                  {/* Output Side */}
                  <div className="w-full md:w-5/12">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      To
                    </h4>
                    {transactionData.outputs.map((output, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                              {output.address && output.address !== "Unknown"
                                ? `${output.address.substring(
                                    0,
                                    6
                                  )}...${output.address.substring(
                                    output.address.length - 4
                                  )}`
                                : "Unknown"}
                            </p>
                            {output.address && output.address !== "Unknown" && (
                              <button
                                onClick={() => copyToClipboard(output.address)}
                                className="text-gray-400 hover:text-gray-600 ml-1"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          {output.entity && output.entity.name && (
                            <div className="mt-1">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCategoryClass(
                                  output.entity.category
                                )}`}
                              >
                                {output.entity.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium">{output.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-6 py-4 text-left"
              onClick={() => toggleSection("risk")}
            >
              <div className="flex items-center">
                <AlertTriangle
                  className={`h-5 w-5 ${
                    transactionData.riskCategory === "high"
                      ? "text-red-500"
                      : transactionData.riskCategory === "moderate"
                      ? "text-orange-500"
                      : "text-green-500"
                  } mr-2`}
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  Risk Assessment
                </h3>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  expandedSections.risk ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.risk && (
              <div className="px-6 pb-6">
                <div className="mb-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      Risk Score:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        getRiskClass(transactionData.riskScore).split(" ")[0]
                      }`}
                    >
                      {transactionData.riskScore.toFixed(2)}
                    </span>
                  </div>
                </div>

                {transactionData.riskIndicators.length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Risk Indicators:
                    </h4>
                    <div>
                      {transactionData.riskIndicators.map(
                        (indicator, index) => (
                          <div
                            key={index}
                            className="mb-3 bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center mb-1">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                  indicator.category === "high"
                                    ? "bg-red-100 text-red-800"
                                    : indicator.category === "medium"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {indicator.type.replace(/_/g, " ")}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                Confidence:{" "}
                                {(indicator.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {indicator.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">
                    No specific risk indicators identified.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Related Transactions */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-6 py-4 text-left"
              onClick={() => toggleSection("related")}
            >
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Top 25 High Risk Transactions
                </h3>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  expandedSections.related ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.related && (
              <div className="px-6 pb-6">
                {highRiskTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Transaction ID
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Value
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Risk Score
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {highRiskTransactions.map((tx, index) => (
                          <tr
                            key={index}
                            className={
                              currentTxId === tx.tx_id ? "bg-blue-50" : ""
                            }
                          >
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {`${
                                tx.tx_id ? tx.tx_id.substring(0, 10) : ""
                              }...${
                                tx.tx_id
                                  ? tx.tx_id.substring(tx.tx_id.length - 6)
                                  : ""
                              }`}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                              {tx.value ? `${tx.value} BTC` : "Unknown"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  parseFloat(tx.High_Risk) >= 0.8
                                    ? "bg-red-100 text-red-800"
                                    : parseFloat(tx.High_Risk) >= 0.5
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {parseFloat(tx.High_Risk).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => loadTransaction(tx.tx_id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    No high risk transactions found.
                  </p>
                )}
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

const ArrowRight = ({ className = "" }) => (
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
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

export default TransactionExplorer;
