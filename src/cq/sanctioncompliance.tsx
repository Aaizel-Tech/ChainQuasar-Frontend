import React, { useState } from "react";
import { jsPDF } from "jspdf";

const SanctionsComplianceWidget = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const sanctionData = {
    total: 127,
    byList: [
      { name: "OFAC SDN", count: 86, color: "#f5222d" },
      { name: "UN Sanctions", count: 23, color: "#fa8c16" },
      { name: "EU Restrictions", count: 12, color: "#faad14" },
      { name: "Local Lists", count: 6, color: "#52c41a" },
    ],
    detailedMatches: [
      {
        id: "SC001",
        entity: "Crypto Wallet 0xA91B...F3D4",
        list: "OFAC SDN",
        date: "2025-03-12",
        riskLevel: "Severe",
        transactionAmount: "4.8 BTC",
        country: "Russia",
      },
      {
        id: "SC002",
        entity: "XYZ Crypto Exchange",
        list: "OFAC SDN",
        date: "2025-03-14",
        riskLevel: "High",
        transactionAmount: "120 ETH",
        country: "Hong Kong",
      },
      {
        id: "SC003",
        entity: "Anonymous Wallet bc1qa...t9p2",
        list: "UN Sanctions",
        date: "2025-03-15",
        riskLevel: "High",
        transactionAmount: "50,000 USDT",
        country: "Iran",
      },
      {
        id: "SC004",
        entity: "FinTech Solutions Ltd.",
        list: "EU Restrictions",
        date: "2025-03-16",
        riskLevel: "Medium",
        transactionAmount: "35,000 EUR",
        country: "Belarus",
      },
      {
        id: "SC005",
        entity: "Cold Storage Wallet 3J98t...JA81",
        list: "OFAC SDN",
        date: "2025-03-17",
        riskLevel: "Severe",
        transactionAmount: "15 BTC",
        country: "North Korea",
      },
      {
        id: "SC006",
        entity: "Darknet Mixer Service AlphaBlend",
        list: "OFAC SDN",
        date: "2025-03-18",
        riskLevel: "Severe",
        transactionAmount: "500 Monero",
        country: "Unknown",
      },
      {
        id: "SC007",
        entity: "Unlicensed Payment Processor",
        list: "Local Lists",
        date: "2025-03-18",
        riskLevel: "Medium",
        transactionAmount: "223110.43 INR",
        country: "India",
      },
      {
        id: "SC008",
        entity: "Suspicious Wallet tb1q9...p6dt",
        list: "UN Sanctions",
        date: "2025-03-19",
        riskLevel: "High",
        transactionAmount: "2.003345 BTC",
        country: "Syria",
      },
    ],
    networkData: {
      nodes: [
        {
          id: "SC001",
          country: "Russia",
          riskLevel: "Severe",
          list: "OFAC SDN",
        },
        {
          id: "SC002",
          country: "Hong Kong",
          riskLevel: "High",
          list: "OFAC SDN",
        },
        {
          id: "SC003",
          country: "Iran",
          riskLevel: "High",
          list: "UN Sanctions",
        },
        {
          id: "SC004",
          country: "Belarus",
          riskLevel: "Medium",
          list: "EU Restrictions",
        },
        {
          id: "SC005",
          country: "North Korea",
          riskLevel: "Severe",
          list: "OFAC SDN",
        },
        {
          id: "SC006",
          country: "Unknown",
          riskLevel: "Severe",
          list: "OFAC SDN",
        },
        {
          id: "SC007",
          country: "India",
          riskLevel: "Medium",
          list: "Local Lists",
        },
        {
          id: "SC008",
          country: "Syria",
          riskLevel: "High",
          list: "UN Sanctions",
        },
      ],
      edges: [
        { source: "SC001", target: "SC005", weight: 0.8 },
        { source: "SC001", target: "SC006", weight: 0.6 },
        { source: "SC002", target: "SC003", weight: 0.7 },
        { source: "SC003", target: "SC008", weight: 0.9 },
        { source: "SC004", target: "SC007", weight: 0.4 },
        { source: "SC005", target: "SC006", weight: 0.85 },
        { source: "SC006", target: "SC008", weight: 0.5 },
      ],
    },
    countryCounts: {
      Russia: 1,
      "Hong Kong": 1,
      Iran: 1,
      Belarus: 1,
      "North Korea": 1,
      Unknown: 1,
      India: 1,
      Syria: 1,
    },
    riskLevelCounts: {
      Severe: 3,
      High: 3,
      Medium: 2,
    },
  };

  const generatePDF = () => {
    try {
      setIsGenerating(true);

      // Create new PDF document with A4 size
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;

      // Define safe margins
      const marginLeft = 20;
      const marginRight = 20;
      const marginTop = 20;
      const marginBottom = 20;

      // Available content area
      const contentWidth = pageWidth - marginLeft - marginRight;
      const contentHeight = pageHeight - marginTop - marginBottom;

      // Add watermark
      addWatermark(doc, pageWidth, pageHeight);

      // Add title
      doc.setFontSize(16);
      doc.text("Sanctions Compliance Report", marginLeft, marginTop);

      // Add date
      doc.setFontSize(10);
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on: ${today}`, marginLeft, marginTop + 10);

      // Add total count
      doc.setFontSize(12);
      doc.text(
        `Total Sanctions Matches: ${sanctionData.total}`,
        marginLeft,
        marginTop + 20
      );

      // Add breakdown by list
      doc.text("Breakdown by Sanctions List:", marginLeft, marginTop + 30);

      // Draw bar chart for sanctions list breakdown
      drawSanctionsBreakdownChart(
        doc,
        marginLeft,
        marginTop + 40,
        sanctionData.byList,
        sanctionData.total,
        contentWidth * 0.8
      );

      // Add detailed matches header
      doc.text("Detailed Sanctions Matches:", marginLeft, marginTop + 90);

      // Add header row for detailed matches
      const tableTop = marginTop + 100;
      doc.setFontSize(10);
      doc.text("ID", marginLeft, tableTop);
      doc.text("Entity", marginLeft + 20, tableTop);
      doc.text("List", marginLeft + 80, tableTop);
      doc.text("Date", marginLeft + 115, tableTop);
      doc.text("Risk", marginLeft + 145, tableTop);
      doc.text("Country", marginLeft + 165, tableTop);

      // Add a line below header
      doc.line(marginLeft, tableTop + 2, pageWidth - marginRight, tableTop + 2);

      // Add data rows
      let yPos = tableTop + 7;
      for (
        let i = 0;
        i < Math.min(5, sanctionData.detailedMatches.length);
        i++
      ) {
        const match = sanctionData.detailedMatches[i];

        doc.text(match.id, marginLeft, yPos);
        doc.text(match.entity.substring(0, 25), marginLeft + 20, yPos);
        doc.text(match.list.substring(0, 10), marginLeft + 80, yPos);
        doc.text(match.date, marginLeft + 115, yPos);
        doc.text(match.riskLevel, marginLeft + 145, yPos);
        doc.text(match.country, marginLeft + 165, yPos);

        yPos += 7;
      }

      // Add "See full list in appendix" if we have more than 5 matches
      if (sanctionData.detailedMatches.length > 5) {
        doc.setFont(undefined, "italic");
        doc.text("See full list in appendix", marginLeft, yPos + 5);
        doc.setFont(undefined, "normal");
      }

      // Add spectral clustering visualization page
      doc.addPage();
      addWatermark(doc, pageWidth, pageHeight);

      // Add page title
      doc.setFontSize(14);
      doc.text("Crypto Transaction Network Analysis", marginLeft, marginTop);

      // Add spectral clustering visualization
      addSpectralClusteringImage(
        doc,
        marginLeft,
        marginTop + 10,
        contentWidth,
        140
      );

      // Add description
      doc.setFontSize(10);
      doc.text(
        "Spectral Clustering of Crypto Transactions reveals potential patterns of illicit activity.",
        marginLeft,
        marginTop + 160
      );
      doc.text(
        "Red nodes represent identified fraudulent transactions with high correlation to sanctioned entities.",
        marginLeft,
        marginTop + 165
      );
      doc.text(
        "Network analysis helps identify clusters of suspicious transactions for further investigation.",
        marginLeft,
        marginTop + 170
      );

      // Add risk level distribution
      doc.setFontSize(12);
      doc.text("Risk Level Distribution:", marginLeft, marginTop + 185);
      drawRiskLevelPieChart(
        doc,
        marginLeft + contentWidth / 4,
        marginTop + 205,
        sanctionData.riskLevelCounts
      );

      // Add geographical distribution
      doc.text(
        "Geographical Distribution:",
        marginLeft + contentWidth / 2,
        marginTop + 185
      );
      drawGeoDistribution(
        doc,
        marginLeft + (contentWidth * 3) / 4,
        marginTop + 205,
        sanctionData.countryCounts
      );

      // Add additional visualizations page
      doc.addPage();
      addWatermark(doc, pageWidth, pageHeight);

      // Add page title
      doc.setFontSize(14);
      doc.text("Sanctions Analysis Visualizations", marginLeft, marginTop);

      // Draw cluster graph representation
      doc.setFontSize(12);
      doc.text("Sanctions Network Analysis:", marginLeft, marginTop + 15);
      drawClusterGraph(
        doc,
        marginLeft + contentWidth / 2,
        marginTop + 60,
        sanctionData.networkData,
        contentWidth * 0.8
      );

      // Add appendix page with full details if needed
      if (sanctionData.detailedMatches.length > 5) {
        doc.addPage();
        addWatermark(doc, pageWidth, pageHeight);

        doc.setFontSize(14);
        doc.text(
          "Appendix: Complete Sanctions Match List",
          marginLeft,
          marginTop
        );

        yPos = marginTop + 15;

        // Add header row
        doc.setFontSize(10);
        doc.text("ID", marginLeft, yPos);
        doc.text("Entity", marginLeft + 20, yPos);
        doc.text("List", marginLeft + 80, yPos);
        doc.text("Date", marginLeft + 115, yPos);
        doc.text("Risk", marginLeft + 140, yPos);
        doc.text("Amount", marginLeft + 160, yPos);

        // Add a line below header
        yPos += 2;
        doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
        yPos += 5;

        // Add all data rows
        sanctionData.detailedMatches.forEach((match, index) => {
          // Check if we need a new page
          if (yPos > pageHeight - marginBottom) {
            doc.addPage();
            addWatermark(doc, pageWidth, pageHeight);
            yPos = marginTop;

            // Re-add header on new page
            doc.text("ID", marginLeft, yPos);
            doc.text("Entity", marginLeft + 20, yPos);
            doc.text("List", marginLeft + 80, yPos);
            doc.text("Date", marginLeft + 115, yPos);
            doc.text("Risk", marginLeft + 140, yPos);
            doc.text("Amount", marginLeft + 160, yPos);

            // Add a line below header
            yPos += 2;
            doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
            yPos += 5;
          }

          doc.text(match.id, marginLeft, yPos);
          doc.text(match.entity.substring(0, 25), marginLeft + 20, yPos);
          doc.text(match.list.substring(0, 10), marginLeft + 80, yPos);
          doc.text(match.date, marginLeft + 115, yPos);
          doc.text(match.riskLevel, marginLeft + 140, yPos);
          doc.text(
            match.transactionAmount.substring(0, 10),
            marginLeft + 160,
            yPos
          );

          yPos += 7;
        });
      }

      // Add footer on every page
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `ChainQuasar Sanctions Report - CONFIDENTIAL | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save("sanctions-report.pdf");

      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
      alert("Failed to generate PDF: " + error.message);
    }
  };

  // Function to add watermark to the page
  const addWatermark = (doc, pageWidth, pageHeight) => {
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.06 }));
    doc.setFontSize(50);
    doc.setTextColor(128, 128, 128);
    doc.text("ChainQuasar", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });
    doc.text("Confidential", pageWidth / 2, pageHeight / 2 + 30, {
      align: "center",
      angle: 45,
    });
    doc.restoreGraphicsState();
    doc.setTextColor(0, 0, 0);
  };

  // Function to add spectral clustering image
  const addSpectralClusteringImage = (doc, x, y, width, height) => {
    // We'll simulate adding an image by drawing a simplified version
    // In a real application, you would load the actual image
    // Define frame
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(x, y, width, height);

    // Add title
    doc.setFontSize(12);
    doc.text(
      "Spectral Clustering of Crypto Transactions",
      x + width / 2,
      y + 10,
      { align: "center" }
    );

    // Create a simplified representation of the spectral clustering
    // Draw oval shape
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);

    // Draw network lines (simplified)
    for (let i = 0; i < 100; i++) {
      const x1 = x + width * (0.2 + Math.random() * 0.6);
      const y1 = y + height * (0.2 + Math.random() * 0.6);
      const x2 = x + width * (0.2 + Math.random() * 0.6);
      const y2 = y + height * (0.2 + Math.random() * 0.6);
      doc.line(x1, y1, x2, y2);
    }

    // Draw nodes
    const nodeColors = [
      [255, 0, 0], // Red (fraudulent)
      [0, 255, 255], // Cyan
      [255, 255, 0], // Yellow
      [0, 0, 255], // Blue
      [0, 255, 0], // Green
      [128, 0, 128], // Purple
    ];

    // Draw nodes in oval pattern
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = width * 0.4;
      const radiusY = height * 0.4;
      const distance = Math.random() * 0.2 + 0.8; // 0.8 to 1.0

      const nodeX = x + width / 2 + Math.cos(angle) * radiusX * distance;
      const nodeY = y + height / 2 + Math.sin(angle) * radiusY * distance;

      // Select color - make about 15% of nodes red (fraudulent)
      const colorIndex =
        Math.random() < 0.15 ? 0 : 1 + Math.floor(Math.random() * 5);
      const color = nodeColors[colorIndex];

      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(nodeX, nodeY, 1, "F");
    }

    // Draw inner nodes
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = width * 0.3;
      const radiusY = height * 0.3;
      const distance = Math.random() * 0.6; // 0 to 0.6

      const nodeX = x + width / 2 + Math.cos(angle) * radiusX * distance;
      const nodeY = y + height / 2 + Math.sin(angle) * radiusY * distance;

      // Select color - make about 15% of nodes red (fraudulent)
      const colorIndex =
        Math.random() < 0.15 ? 0 : 1 + Math.floor(Math.random() * 5);
      const color = nodeColors[colorIndex];

      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(nodeX, nodeY, 1, "F");
    }

    // Add legend
    doc.setFillColor(255, 0, 0);
    doc.circle(x + width - 40, y + 15, 2, "F");
    doc.setFontSize(8);
    doc.text("Fraudulent Nodes", x + width - 35, y + 17);
  };

  // Function to draw sanctions breakdown chart
  const drawSanctionsBreakdownChart = (doc, x, y, data, total, maxWidth) => {
    const barHeight = 8;
    const spacing = 12;

    data.forEach((item, index) => {
      const yPosition = y + index * spacing;
      const percentage = (item.count / total) * 100;
      const barWidth = (percentage / 100) * maxWidth;

      // Draw bar
      doc.setFillColor(
        hexToRgb(item.color).r,
        hexToRgb(item.color).g,
        hexToRgb(item.color).b
      );
      doc.rect(x, yPosition, barWidth, barHeight, "F");

      // Draw label and count
      doc.setFontSize(9);
      doc.text(
        `${item.name}: ${item.count} (${percentage.toFixed(1)}%)`,
        x + maxWidth + 10,
        yPosition + 6
      );
    });
  };

  // Function to draw risk level pie chart
  const drawRiskLevelPieChart = (doc, x, y, data) => {
    const radius = 20;
    const colors = {
      Severe: "#d9363e",
      High: "#f5a623",
      Medium: "#ffcc00",
    };

    // Calculate total
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);

    // Draw pie sectors
    let startAngle = 0;
    Object.entries(data).forEach(([level, count]) => {
      const angle = (count / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;

      // Draw sector
      doc.setFillColor(
        hexToRgb(colors[level]).r,
        hexToRgb(colors[level]).g,
        hexToRgb(colors[level]).b
      );
      drawPieSlice(doc, x, y, radius, startAngle, endAngle);

      // Calculate label position
      const labelAngle = startAngle + angle / 2;
      const labelX = x + (radius + 12) * Math.cos(labelAngle);
      const labelY = y + (radius + 12) * Math.sin(labelAngle);

      // Draw label
      doc.setFontSize(8);
      doc.text(
        `${level}: ${count} (${((count / total) * 100).toFixed(1)}%)`,
        labelX,
        labelY
      );

      startAngle = endAngle;
    });

    // Draw center circle (optional, for donut chart effect)
    doc.setFillColor(255, 255, 255);
    doc.circle(x, y, radius / 2, "F");
  };

  // Function to draw a pie slice
  const drawPieSlice = (doc, x, y, radius, startAngle, endAngle) => {
    // Move to center
    doc.lines(
      [
        [radius * Math.cos(startAngle), radius * Math.sin(startAngle)],
        ...getArcPoints(radius, startAngle, endAngle),
        [0, 0],
      ],
      x,
      y,
      [1, 1],
      "F"
    );
  };

  // Function to get points along an arc for pie slices
  const getArcPoints = (radius, startAngle, endAngle) => {
    const points = [];
    const steps = Math.max(5, Math.floor((endAngle - startAngle) * 25));
    const angleStep = (endAngle - startAngle) / steps;

    for (let i = 1; i <= steps; i++) {
      const angle = startAngle + i * angleStep;
      points.push([
        radius * Math.cos(angle) - radius * Math.cos(angle - angleStep),
        radius * Math.sin(angle) - radius * Math.sin(angle - angleStep),
      ]);
    }

    return points;
  };

  // Function to draw cluster graph
  const drawClusterGraph = (doc, x, y, data, width) => {
    const nodeRadius = 4;
    const height = 80;
    const nodePositions = {};

    // Create node positions
    data.nodes.forEach((node, index) => {
      // Create a layout based on risk level and list
      let xPos, yPos;

      if (node.list === "OFAC SDN") {
        xPos = x - width / 4 + (index % 4) * 15;
      } else if (node.list === "UN Sanctions") {
        xPos = x - width / 8 + (index % 2) * 15;
      } else {
        xPos = x + width / 8 + (index % 3) * 15;
      }

      if (node.riskLevel === "Severe") {
        yPos = y - 15;
      } else if (node.riskLevel === "High") {
        yPos = y;
      } else {
        yPos = y + 15;
      }

      nodePositions[node.id] = { x: xPos, y: yPos };
    });

    // Draw edges first
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);

    data.edges.forEach((edge) => {
      if (nodePositions[edge.source] && nodePositions[edge.target]) {
        const source = nodePositions[edge.source];
        const target = nodePositions[edge.target];

        // Line width based on weight
        doc.setLineWidth(edge.weight * 0.5);
        doc.line(source.x, source.y, target.x, target.y);
      }
    });

    // Reset line width
    doc.setLineWidth(0.5);

    // Draw nodes
    data.nodes.forEach((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      // Set color based on list
      let fillColor;
      switch (node.list) {
        case "OFAC SDN":
          fillColor = hexToRgb("#f5222d");
          break;
        case "UN Sanctions":
          fillColor = hexToRgb("#fa8c16");
          break;
        case "EU Restrictions":
          fillColor = hexToRgb("#faad14");
          break;
        default:
          fillColor = hexToRgb("#52c41a");
      }

      // Draw circle
      doc.setFillColor(fillColor.r, fillColor.g, fillColor.b);
      doc.circle(pos.x, pos.y, nodeRadius, "F");

      // Add node ID label
      doc.setFontSize(6);
      doc.text(node.id, pos.x, pos.y + nodeRadius + 4, { align: "center" });
    });

    // Add legend
    const legendY = y + height / 2;

    doc.setFontSize(8);
    doc.setFillColor(
      hexToRgb("#f5222d").r,
      hexToRgb("#f5222d").g,
      hexToRgb("#f5222d").b
    );
    doc.circle(x - width / 3, legendY, 3, "F");
    doc.text("OFAC SDN", x - width / 3 + 5, legendY + 2);

    doc.setFillColor(
      hexToRgb("#fa8c16").r,
      hexToRgb("#fa8c16").g,
      hexToRgb("#fa8c16").b
    );
    doc.circle(x - width / 3 + 45, legendY, 3, "F");
    doc.text("UN Sanctions", x - width / 3 + 50, legendY + 2);

    doc.setFillColor(
      hexToRgb("#faad14").r,
      hexToRgb("#faad14").g,
      hexToRgb("#faad14").b
    );
    doc.circle(x - width / 3 + 45, legendY + 10, 3, "F");
    doc.text("EU Restrictions", x - width / 3 + 50, legendY + 12);

    doc.setFillColor(
      hexToRgb("#52c41a").r,
      hexToRgb("#52c41a").g,
      hexToRgb("#52c41a").b
    );
    doc.circle(x - width / 3, legendY + 10, 3, "F");
    doc.text("Local Lists", x - width / 3 + 5, legendY + 12);
  };

  // Function to draw geographical distribution chart
  const drawGeoDistribution = (doc, x, y, data) => {
    const maxBarWidth = 60;
    const barHeight = 6;
    const spacing = 10;

    // Calculate total
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);

    // Sort countries by count (descending)
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

    // Draw horizontal bar chart
    sortedData.forEach((entry, index) => {
      const [country, count] = entry;
      const yPos = y + index * spacing;
      const percentage = (count / total) * 100;
      const barWidth = (percentage / 100) * maxBarWidth;

      // Get color based on sanctions concentration
      const colorIntensity = Math.min(255, 150 + percentage * 2);
      doc.setFillColor(colorIntensity, 80, 80);

      // Draw bar
      doc.rect(x - maxBarWidth / 2, yPos, barWidth, barHeight, "F");

      // Draw label
      doc.setFontSize(8);
      doc.text(`${country}: ${count}`, x - maxBarWidth / 2 - 40, yPos + 5);
    });
  };

  // Utility function to convert hex color to RGB
  const hexToRgb = (hex) => {
    // Remove # if present
    hex = hex.replace("#", "");

    // Convert 3-digit hex to 6-digits
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((h) => h + h)
        .join("");
    }

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sanctions Compliance</h2>
        <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
          8 New Hits
        </div>
      </div>

      <div className="flex justify-between mb-2">
        <div className="text-gray-500 text-sm">Total Sanctions Matches:</div>
        <div className="font-semibold">{sanctionData.total}</div>
      </div>

      <div className="space-y-2 mt-4">
        {sanctionData.byList.map((item, index) => (
          <div key={index} className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>{item.name}</span>
              <span className="font-medium">{item.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(item.count / sanctionData.total) * 100}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t flex justify-between">
        <button
          className={`${
            isGenerating ? "bg-blue-400" : "bg-blue-600"
          } text-white px-3 py-1 rounded text-sm flex items-center`}
          onClick={generatePDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            "Generate Enhanced Report"
          )}
        </button>
      </div>
    </div>
  );
};

export default SanctionsComplianceWidget;
