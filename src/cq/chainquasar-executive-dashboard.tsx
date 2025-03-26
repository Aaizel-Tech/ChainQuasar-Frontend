import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";

import SanctionsComplianceWidget from "./sanctioncompliance";
const ChainQuasarExecutiveDashboard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("RUB");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedLanguage, setSelectedLanguage] = useState("ru");

  // Translations for dashboard elements
  const translations = {
    ru: {
      title: "ChainQuasar: Аналитика блокчейна",
      subtitle: "Панель мониторинга финансовых потоков",
      overview: "Обзор рынка",
      riskAnalysis: "Анализ рисков",
      transactions: "Транзакции",
      entities: "Сущности",
      corridors: "Финансовые коридоры",
      compliance: "Регуляторный контроль",
      darkweb: "Мониторинг даркнет",
      sanctions: "Проверка санкций",
      highRisk: "Высокий риск",
      mediumRisk: "Средний риск",
      lowRisk: "Низкий риск",
      noRisk: "Без риска",
      inbound: "Входящие",
      outbound: "Исходящие",
      exchange: "Биржа",
      mixer: "Миксер",
      service: "Сервис",
      institution: "Финансовое учреждение",
      viewDetails: "Подробнее",
      transactionVolume: "Объем транзакций",
      riskDistribution: "Распределение рисков",
      dataSovereignty: "Суверенитет данных",
      alerts: "Оповещения",
      lastUpdated: "Последнее обновление",
      totalMonitored: "Всего под мониторингом",
      sanctionsIdentified: "Выявлено санкций",
      suspiciousActivity: "Подозрительная активность",
      billion: "млрд",
      million: "млн",
      thousand: "тыс",
      type: "Тип",
      percentage: "Процент",
      transactionsCol: "Транзакции",
      distribution: "Распределение",
      investigate: "Исследовать",
      generateReport: "Сформировать отчет",
      showAll: "Показать все",
      showAllNetworks: "Все сети",
      lastWeek: "прошлую неделю",
      lastMonth: "прошлый месяц",
      lastQuarter: "прошлый квартал",
      newItems: "новых",
      militaryGradeEncryption: "Военный уровень шифрования",
      regulatoryCompliance: "Соответствие нормативным требованиям",
      dataSovereigntyFooter:
        "Обработка данных происходит в пределах вашей юрисдикции",
      entries: "записей",
    },
    en: {
      title: "ChainQuasar: Blockchain Analytics",
      subtitle: "Financial Flow Monitoring Dashboard",
      overview: "Market Overview",
      riskAnalysis: "Risk Analysis",
      transactions: "Transactions",
      entities: "Entities",
      corridors: "Financial Corridors",
      compliance: "Regulatory Control",
      darkweb: "Darkweb Monitoring",
      sanctions: "Sanctions Screening",
      highRisk: "High Risk",
      mediumRisk: "Medium Risk",
      lowRisk: "Low Risk",
      noRisk: "No Risk",
      inbound: "Inbound",
      outbound: "Outbound",
      exchange: "Exchange",
      mixer: "Mixer",
      service: "Service",
      institution: "Financial Institution",
      viewDetails: "View Details",
      transactionVolume: "Transaction Volume",
      riskDistribution: "Risk Distribution",
      dataSovereignty: "Data Sovereignty",
      alerts: "Alerts",
      lastUpdated: "Last Updated",
      totalMonitored: "Total Monitored",
      sanctionsIdentified: "Sanctions Identified",
      suspiciousActivity: "Suspicious Activity",
      billion: "B",
      million: "M",
      thousand: "K",
      type: "Type",
      percentage: "Percentage",
      transactionsCol: "Transactions",
      distribution: "Distribution",
      investigate: "Investigate",
      generateReport: "Generate Report",
      showAll: "Show All",
      showAllNetworks: "All Networks",
      lastWeek: "last week",
      lastMonth: "last month",
      lastQuarter: "last quarter",
      newItems: "new",
      militaryGradeEncryption: "Military-grade encryption",
      regulatoryCompliance: "Regulatory compliance",
      dataSovereigntyFooter:
        "All data processing occurs within your jurisdiction",
      entries: "entries",
    },
  };

  // Use selected language for translations
  const t = translations[selectedLanguage];

  // Mock data for charts
  const currencySymbol =
    selectedCurrency === "RUB" ? "₽" : selectedCurrency === "KZT" ? "₸" : "$";

  const transactionVolumeData = [
    { name: "Jan", RUB: 24.5, KZT: 18.3, USD: 4.2 },
    { name: "Feb", RUB: 28.1, KZT: 21.4, USD: 4.8 },
    { name: "Mar", RUB: 32.7, KZT: 24.9, USD: 5.5 },
    { name: "Apr", RUB: 38.2, KZT: 29.1, USD: 6.4 },
    { name: "May", RUB: 42.8, KZT: 32.6, USD: 7.1 },
    { name: "Jun", RUB: 48.3, KZT: 36.8, USD: 8.0 },
    { name: "Jul", RUB: 53.1, KZT: 40.5, USD: 8.8 },
  ];

  const riskData = [
    { name: t.highRisk, value: 15.7, color: "#FF4D4F" },
    { name: t.mediumRisk, value: 28.3, color: "#FF7A45" },
    { name: t.lowRisk, value: 34.5, color: "#FFC53D" },
    { name: t.noRisk, value: 21.5, color: "#52C41A" },
  ];

  const corridorData = [
    { name: "Moscow", value: 42.8, inbound: 18.3, outbound: 24.5 },
    { name: "St. Petersburg", value: 23.1, inbound: 9.7, outbound: 13.4 },
    { name: "Almaty", value: 18.7, inbound: 11.2, outbound: 7.5 },
    { name: "Astana", value: 15.4, inbound: 8.7, outbound: 6.7 },
    { name: "Yekaterinburg", value: 12.8, inbound: 5.9, outbound: 6.9 },
  ];

  const entityData = [
    { name: t.exchange, percentage: 35, transactions: 1245000 },
    { name: t.mixer, percentage: 12, transactions: 432000 },
    { name: t.service, percentage: 28, transactions: 975000 },
    { name: t.institution, percentage: 25, transactions: 865000 },
  ];

  const sanctionsData = [
    { name: "OFAC", count: 154, color: "#FF4D4F" },
    { name: "EU", count: 87, color: "#1890FF" },
    { name: "UN", count: 63, color: "#722ED1" },
    { name: "Local", count: 42, color: "#52C41A" },
  ];

  const alertsData = [
    {
      id: "ALT-7843",
      type: "High-volume transaction",
      entity: "Unknown Exchange",
      time: "14 min ago",
      risk: "High",
    },
    {
      id: "ALT-7842",
      type: "Sanctions match",
      entity: "Wallet 0x71f2...8a3b",
      time: "42 min ago",
      risk: "Severe",
    },
    {
      id: "ALT-7841",
      type: "Suspicious pattern",
      entity: "Wallet bc1q8...r9p2",
      time: "1 hr ago",
      risk: "Medium",
    },
    {
      id: "ALT-7840",
      type: "Darkweb mention",
      entity: "Mixer Service",
      time: "2 hr ago",
      risk: "High",
    },
    {
      id: "ALT-7839",
      type: "Large transaction",
      entity: "RegionalPay",
      time: "3 hr ago",
      risk: "Medium",
    },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Severe":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Custom tooltip style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
          <p className="text-gray-300">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-lg font-semibold"
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value} ${
                entry.name === t.inbound || entry.name === t.outbound
                  ? `${t.billion} ${currencySymbol}`
                  : entry.name === selectedCurrency
                  ? `${t.billion} ${currencySymbol}`
                  : "%"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Legend formatter to ensure translations
  const legendFormatter = (value) => {
    // Map English legend values to the translated ones if needed
    if (selectedLanguage === "ru") {
      if (value === "Inbound") return t.inbound;
      if (value === "Outbound") return t.outbound;
      // Add other translations as needed
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 shadow-xl">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-blue-200 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex rounded-lg overflow-hidden shadow-lg">
              <button
                onClick={() => setSelectedLanguage("ru")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedLanguage === "ru"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setSelectedLanguage("en")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedLanguage === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                EN
              </button>
            </div>
            <div className="flex rounded-lg overflow-hidden shadow-lg">
              <button
                onClick={() => setSelectedCurrency("RUB")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCurrency === "RUB"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                ₽ RUB
              </button>
              <button
                onClick={() => setSelectedCurrency("KZT")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCurrency === "KZT"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                ₸ KZT
              </button>
            </div>
            <div className="flex rounded-lg overflow-hidden shadow-lg">
              <button
                onClick={() => setSelectedTimeframe("7d")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedTimeframe === "7d"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setSelectedTimeframe("30d")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedTimeframe === "30d"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setSelectedTimeframe("90d")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedTimeframe === "90d"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                90D
              </button>
            </div>
            <div className="flex items-center px-4 py-2 bg-blue-800 bg-opacity-50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-blue-100">
                {t.lastUpdated}: 3{" "}
                {selectedLanguage === "ru" ? "мин назад" : "min ago"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mr-5">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {t.totalMonitored}
                </p>
                <div className="flex items-end mt-1">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    42.8
                  </h2>
                  <p className="ml-2 text-xl text-gray-600 dark:text-gray-300">
                    {t.billion} {currencySymbol}
                  </p>
                </div>
                <p className="text-green-500 dark:text-green-400 text-sm font-medium mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  +4.2% vs.{" "}
                  {selectedTimeframe === "7d"
                    ? t.lastWeek
                    : selectedTimeframe === "30d"
                    ? t.lastMonth
                    : t.lastQuarter}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-4 mr-5">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {t.sanctionsIdentified}
                </p>
                <div className="flex items-end mt-1">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    346
                  </h2>
                  <p className="ml-2 text-xl text-gray-600 dark:text-gray-300">
                    {selectedLanguage === "ru" ? t.entries : t.entries}
                  </p>
                </div>
                <p className="text-red-500 dark:text-red-400 text-sm font-medium mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  +12.3% vs.{" "}
                  {selectedTimeframe === "7d"
                    ? t.lastWeek
                    : selectedTimeframe === "30d"
                    ? t.lastMonth
                    : t.lastQuarter}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-4 mr-5">
                <svg
                  className="w-8 h-8 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {t.suspiciousActivity}
                </p>
                <div className="flex items-end mt-1">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    7.2
                  </h2>
                  <p className="ml-2 text-xl text-gray-600 dark:text-gray-300">
                    {t.billion} {currencySymbol}
                  </p>
                </div>
                <p className="text-orange-500 dark:text-orange-400 text-sm font-medium mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  +8.7% vs.{" "}
                  {selectedTimeframe === "7d"
                    ? t.lastWeek
                    : selectedTimeframe === "30d"
                    ? t.lastMonth
                    : t.lastQuarter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto pb-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Volume Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.transactionVolume}
              </h2>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300 mr-2">
                  {selectedLanguage === "ru" ? "Показать:" : "Show:"}
                </span>
                <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>{t.showAllNetworks}</option>
                  <option>Bitcoin</option>
                  <option>Ethereum</option>
                  <option>Tron</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={transactionVolumeData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
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
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">{t.riskDistribution}</h2>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                {riskData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="text-sm flex justify-between w-full">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Financial Corridors */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.corridors}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={corridorData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
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
                <Bar
                  dataKey="inbound"
                  name={t.inbound}
                  stackId="a"
                  fill="#3B8"
                  radius={[4, 4, 0, 0]}
                >
                  {corridorData.map((entry, index) => (
                    <Cell key={`cell-in-${index}`} fill="#3B8" />
                  ))}
                </Bar>
                <Bar
                  dataKey="outbound"
                  name={t.outbound}
                  stackId="a"
                  fill="#6366F1"
                  radius={[4, 4, 0, 0]}
                >
                  {corridorData.map((entry, index) => (
                    <Cell key={`cell-out-${index}`} fill="#6366F1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sanctions Screening */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t.sanctions}</h2>
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                8 {t.lastUpdated === "Последнее обновление" ? "новых" : "new"}
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {sanctionsData.map((item, index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count /
                            sanctionsData.reduce(
                              (sum, i) => sum + i.count,
                              0
                            )) *
                          100
                        }%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t flex justify-between">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                {t.lastUpdated === "Последнее обновление"
                  ? "Сформировать отчет"
                  : "Generate Report"}
              </button>
            </div>
          </div>

          {/* Entity Distribution */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">{t.entities}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.lastUpdated === "Последнее обновление"
                        ? "Тип"
                        : "Type"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.lastUpdated === "Последнее обновление"
                        ? "Процент"
                        : "Percentage"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.lastUpdated === "Последнее обновление"
                        ? "Транзакции"
                        : "Transactions"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.lastUpdated === "Последнее обновление"
                        ? "Распределение"
                        : "Distribution"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entityData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.transactions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{t.alerts}</h2>
              <button className="text-blue-600 text-sm">{t.viewDetails}</button>
            </div>
            <div className="overflow-hidden overflow-y-auto h-64 pr-2">
              {alertsData.map((alert) => (
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
                  <button className="text-blue-600 text-xs">
                    {t.lastUpdated === "Последнее обновление"
                      ? "Исследовать"
                      : "Investigate"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 py-4 text-center text-gray-400 text-sm">
        <p>
          {t.lastUpdated === "Последнее обновление"
            ? "ChainQuasar - Обработка данных происходит в пределах вашей юрисдикции"
            : "ChainQuasar - All data processing occurs within your jurisdiction"}
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>{t.dataSovereignty}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>
              {t.lastUpdated === "Последнее обновление"
                ? "Военный уровень шифрования"
                : "Military-grade encryption"}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>
              {t.lastUpdated === "Последнее обновление"
                ? "Соответствие нормативным требованиям"
                : "Regulatory compliance"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainQuasarExecutiveDashboard;
