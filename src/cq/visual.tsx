import React, { useState, useEffect } from "react";
import { ResponsiveNetwork } from "@nivo/network";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import "@/App.css";

// Existing parseCSV function remains the same
const parseCSV = async (filePath: string) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map((line) => {
      const values = line.split(",");
      const record: Record<string, any> = {};

      headers.forEach((header, index) => {
        const value = values[index];

        // Convert numeric fields
        if (
          [
            "height",
            "timestamp",
            "value",
            "fee",
            "size",
            "vsize",
            "weight",
          ].includes(header)
        ) {
          record[header] = value ? parseFloat(value) : 0;
        } else {
          record[header] = value;
        }
      });

      return record;
    });
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw error;
  }
};

interface Transaction {
  block_hash: string;
  height: number;
  timestamp: number;
  datetime: string;
  tx_id: string;
  tx_hash: string;
  sender_address: string;
  receiver_address: string;
  value: number;
  fee: number;
  size: number;
  vsize: number;
  weight: number;
  scriptPubKey_hex: string;
  scriptPubKey_type: string;
}

interface NetworkNode {
  id: string;
  radius: number;
  depth: number;
  color: string;
}

interface NetworkLink {
  source: string;
  target: string;
  distance: number;
  width: number;
}

interface CorrelationData {
  id: string;
  data: Array<{ x: string; y: number }>;
}

const VApp: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<string>("relationships");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [topAddresses, setTopAddresses] = useState<
    { address: string; value: number }[]
  >([]);
  const [networkData, setNetworkData] = useState<{
    nodes: NetworkNode[];
    links: NetworkLink[];
  }>({ nodes: [], links: [] });
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [scriptTypeData, setScriptTypeData] = useState<any[]>([]);
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [filePath, setFilePath] = useState<string>("./bitcoin_blocks2.csv");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await parseCSV(filePath);
        setTransactions(data as Transaction[]);
        processData(data as Transaction[]);
        setLoading(false);
      } catch (err) {
        setError(
          `Failed to load data. Please ensure the CSV file is accessible. Error: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setLoading(false);
        console.error("Error loading data:", err);
      }
    };

    loadData();
  }, [filePath]);

  // Existing handlers remain the same
  const handleFilePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilePath(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const lines = event.target.result.trim().split("\n");
          const headers = lines[0].split(",");

          const parsedData = lines.slice(1).map((line) => {
            const values = line.split(",");
            const record: Record<string, any> = {};

            headers.forEach((header, index) => {
              const value = values[index];

              if (
                [
                  "height",
                  "timestamp",
                  "value",
                  "fee",
                  "size",
                  "vsize",
                  "weight",
                ].includes(header)
              ) {
                record[header] = value ? parseFloat(value) : 0;
              } else {
                record[header] = value;
              }
            });

            return record;
          });

          setTransactions(parsedData as Transaction[]);
          processData(parsedData as Transaction[]);
          setLoading(false);
          setError(null);
        }
      };

      reader.onerror = () => {
        setError("Failed to read the file.");
      };

      reader.readAsText(file);
    }
  };

  // Process the data to generate visualization data
  const processData = (data: Transaction[]) => {
    if (!data || data.length === 0) {
      setError("No data to process.");
      return;
    }

    console.log("Processing data:", data.length, "transactions");

    // Calculate top addresses by transaction value (existing code)
    const addressValues = new Map<string, number>();

    data.forEach((tx) => {
      if (
        tx.receiver_address &&
        tx.receiver_address !== "UNKNOWN" &&
        tx.receiver_address !== "OP_RETURN"
      ) {
        addressValues.set(
          tx.receiver_address,
          (addressValues.get(tx.receiver_address) || 0) + (tx.value || 0)
        );
      }

      if (tx.sender_address) {
        const senders = tx.sender_address.split("|");
        senders.forEach((sender) => {
          if (sender && sender !== "UNKNOWN" && sender !== "COINBASE") {
            addressValues.set(
              sender,
              (addressValues.get(sender) || 0) - (tx.value || 0)
            );
          }
        });
      }
    });

    const sortedAddresses = Array.from(addressValues.entries())
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 10)
      .map(([address, value]) => ({ address, value: Math.abs(value) }));

    setTopAddresses(sortedAddresses);

    // Existing visualization generations
    generateNetworkData(
      data,
      sortedAddresses.map((a) => a.address)
    );
    generateTimeSeriesData(data);
    generateScriptTypeDistribution(data);

    // New correlation visualizations
    generateCorrelationHeatmap(data);
    generateScatterPlotData(data);
  };

  // Existing network data generation code remains the same
  const generateNetworkData = (data: Transaction[], topAddrs: string[]) => {
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];
    const addressSet = new Set<string>();
    const connections = new Map<string, Map<string, number>>();

    // Add top addresses as initial nodes
    topAddrs.forEach((addr, index) => {
      addressSet.add(addr);
      nodes.push({
        id: addr,
        radius: 8,
        depth: 0,
        color: getRandomColor(index),
      });
    });

    // Generate connections between addresses
    data.forEach((tx) => {
      if (
        !tx.receiver_address ||
        tx.receiver_address === "UNKNOWN" ||
        tx.receiver_address === "OP_RETURN"
      )
        return;
      if (!tx.sender_address) return;

      const senders = tx.sender_address.split("|");
      senders.forEach((sender) => {
        if (!sender || sender === "UNKNOWN" || sender === "COINBASE") return;

        // Add connection from sender to receiver
        if (!connections.has(sender)) {
          connections.set(sender, new Map<string, number>());
        }

        const senderConnections = connections.get(sender)!;
        senderConnections.set(
          tx.receiver_address,
          (senderConnections.get(tx.receiver_address) || 0) + (tx.value || 0)
        );

        // Add nodes if they're not already in the set (and they're connected to our top addresses)
        if (!addressSet.has(sender) && topAddrs.includes(tx.receiver_address)) {
          addressSet.add(sender);
          nodes.push({
            id: sender,
            radius: 5,
            depth: 1,
            color: "#888888",
          });
        }

        if (!addressSet.has(tx.receiver_address) && topAddrs.includes(sender)) {
          addressSet.add(tx.receiver_address);
          nodes.push({
            id: tx.receiver_address,
            radius: 5,
            depth: 1,
            color: "#888888",
          });
        }
      });
    });

    // Create links based on connections
    connections.forEach((targets, source) => {
      targets.forEach((value, target) => {
        // Only include connections if both nodes are in our node set
        if (addressSet.has(source) && addressSet.has(target)) {
          links.push({
            source,
            target,
            distance: 100,
            width: Math.log(value + 1) / 2,
          });
        }
      });
    });

    setNetworkData({ nodes, links });
  };

  // Existing time series data generation code remains the same
  const generateTimeSeriesData = (data: Transaction[]) => {
    // Group transactions by hour
    const txByHour = new Map<
      number,
      { count: number; volume: number; avgFee: number }
    >();

    data.forEach((tx) => {
      if (!tx.timestamp) return;

      const hourTimestamp = Math.floor(tx.timestamp / 3600) * 3600;

      if (!txByHour.has(hourTimestamp)) {
        txByHour.set(hourTimestamp, { count: 0, volume: 0, avgFee: 0 });
      }

      const hourData = txByHour.get(hourTimestamp)!;
      hourData.count += 1;
      hourData.volume += tx.value || 0;
      hourData.avgFee += tx.fee || 0;
    });

    // Convert to time series format with added avg fee
    const txCountSeries = {
      id: "Transaction Count",
      data: Array.from(txByHour.entries())
        .map(([hour, data]) => ({
          x: new Date(hour * 1000).toISOString(),
          y: data.count,
        }))
        .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()),
    };

    const txVolumeSeries = {
      id: "Transaction Volume (BTC)",
      data: Array.from(txByHour.entries())
        .map(([hour, data]) => ({
          x: new Date(hour * 1000).toISOString(),
          y: data.volume,
        }))
        .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()),
    };

    const txFeeSeries = {
      id: "Average Fee",
      data: Array.from(txByHour.entries())
        .map(([hour, data]) => ({
          x: new Date(hour * 1000).toISOString(),
          y: data.count > 0 ? data.avgFee / data.count : 0,
        }))
        .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()),
    };

    setTimeSeriesData([txCountSeries, txVolumeSeries, txFeeSeries]);
  };

  // Existing script type distribution generation remains the same
  const generateScriptTypeDistribution = (data: Transaction[]) => {
    const scriptTypeCounts = new Map<string, number>();

    data.forEach((tx) => {
      const type = tx.scriptPubKey_type || "unknown";
      scriptTypeCounts.set(type, (scriptTypeCounts.get(type) || 0) + 1);
    });

    const scriptTypeData = Array.from(scriptTypeCounts.entries())
      .map(([id, value]) => ({ id, value }))
      .sort((a, b) => b.value - a.value);

    setScriptTypeData(scriptTypeData);
  };

  // New correlation heatmap generator
  const generateCorrelationHeatmap = (data: Transaction[]) => {
    // Define numeric fields to correlate
    const numericFields = ["value", "fee", "size", "vsize", "weight"];

    // Create correlation matrix
    const correlationMatrix = [];

    for (const field1 of numericFields) {
      const row: { id: string; [key: string]: any } = { id: field1 };

      for (const field2 of numericFields) {
        // Calculate Pearson correlation coefficient
        const fieldData = data.filter(
          (tx) =>
            tx[field1] !== undefined &&
            tx[field2] !== undefined &&
            !isNaN(tx[field1]) &&
            !isNaN(tx[field2]) &&
            tx[field1] !== null &&
            tx[field2] !== null
        );

        if (fieldData.length === 0) {
          row[field2] = 0;
          continue;
        }

        // Check if we have enough data for meaningful correlation
        if (fieldData.length < 5) {
          row[field2] = 0;
          continue;
        }

        // Check if all values are identical (would cause division by zero)
        const allSameValues1 = fieldData.every(
          (tx) => tx[field1] === fieldData[0][field1]
        );
        const allSameValues2 = fieldData.every(
          (tx) => tx[field2] === fieldData[0][field2]
        );

        if (allSameValues1 || allSameValues2) {
          row[field2] = allSameValues1 && allSameValues2 ? 1 : 0;
          continue;
        }

        try {
          const values1 = fieldData.map((tx) => tx[field1]);
          const values2 = fieldData.map((tx) => tx[field2]);

          const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
          const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

          const numerator = values1.reduce(
            (sum, val, i) => sum + (val - mean1) * (values2[i] - mean2),
            0
          );

          const denom1 = Math.sqrt(
            values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0)
          );

          const denom2 = Math.sqrt(
            values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
          );

          // Avoid division by zero
          const corr =
            denom1 === 0 || denom2 === 0 ? 0 : numerator / (denom1 * denom2);

          // Handle NaN and clamp values between -1 and 1
          row[field2] = isNaN(corr)
            ? 0
            : Math.max(-1, Math.min(1, parseFloat(corr.toFixed(2))));
        } catch (error) {
          console.error(
            `Error calculating correlation for ${field1} vs ${field2}:`,
            error
          );
          row[field2] = 0;
        }
      }

      correlationMatrix.push(row);
    }

    setCorrelationData(correlationMatrix);
  };
  // New scatter plot data generator
  const generateScatterPlotData = (data: Transaction[]) => {
    // Create scatter plot comparing fees to transaction size
    try {
      // Filter out invalid data points
      const validData = data.filter(
        (tx) =>
          tx.fee !== undefined &&
          tx.size !== undefined &&
          tx.value !== undefined &&
          !isNaN(tx.fee) &&
          !isNaN(tx.size) &&
          !isNaN(tx.value) &&
          tx.fee !== null &&
          tx.size !== null &&
          tx.value !== null
      );

      // Limit the number of points to improve performance
      const sampleSize = Math.min(500, validData.length);
      const sampledData = validData.slice(0, sampleSize);

      // Create datasets
      const scatterData = [
        {
          id: "Fee vs Size",
          data: sampledData.map((tx) => ({
            x: tx.size,
            y: tx.fee,
            transactionId: tx.tx_id || "unknown",
          })),
        },
        {
          id: "Fee vs Value",
          data: sampledData.map((tx) => ({
            x: tx.value,
            y: tx.fee,
            transactionId: tx.tx_id || "unknown",
          })),
        },
      ];

      // Filter out datasets with no points
      const filteredScatterData = scatterData.filter(
        (dataset) => dataset.data.length > 0
      );

      if (filteredScatterData.length === 0) {
        console.warn("No valid data points for scatter plots");
      }

      setScatterData(filteredScatterData);
    } catch (error) {
      console.error("Error generating scatter plot data:", error);
      setScatterData([]);
    }
  };

  // Updated views to handle empty data more gracefully
  // For correlation view
  {
    view === "correlation" && (
      <div className="visualization correlation-visualization">
        <h2>Transaction Parameter Correlation</h2>
        <p>
          Heatmap showing Pearson correlation coefficients between transaction
          parameters. Values close to 1 indicate strong positive correlation,
          values close to -1 indicate strong negative correlation, and values
          near 0 indicate little to no correlation.
        </p>
        <div className="chart-container">
          {correlationData.length > 0 ? (
            <ResponsiveHeatMap
              data={correlationData}
              margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
              valueFormat=".2f"
              axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "",
                legendOffset: 46,
              }}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "",
                legendPosition: "middle",
                legendOffset: 36,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: -72,
              }}
              colors={{
                type: "diverging",
                scheme: "red_blue",
                divergeAt: 0.5,
                minValue: -1,
                maxValue: 1,
              }}
              emptyColor="#555555"
              hoverTarget="cell"
              cellOpacity={1}
              cellBorderColor={{
                from: "color",
                modifiers: [["darker", 0.4]],
              }}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.8]],
              }}
              legends={[
                {
                  anchor: "bottom",
                  translateX: 0,
                  translateY: 30,
                  length: 140,
                  thickness: 12,
                  direction: "row",
                  tickPosition: "after",
                  tickSize: 3,
                  tickSpacing: 4,
                  tickOverlap: false,
                  tickFormat: ".2f",
                  title: "Correlation Coefficient →",
                  titleAlign: "start",
                  titleOffset: 4,
                },
              ]}
            />
          ) : (
            <div className="no-data">
              No correlation data available or processing...
            </div>
          )}
        </div>
      </div>
    );
  }

  const getRandomColor = (index: number) => {
    const colors = [
      "#61cdbb",
      "#97e3d5",
      "#e8c1a0",
      "#f47560",
      "#f1e15b",
      "#e8a838",
      "#61cdbb",
      "#97e3d5",
      "#e8c1a0",
      "#f47560",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return <div className="loading">Loading transaction data...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Bitcoin Blockchain Visualization</h1>

        <div className="file-input-container">
          <div className="file-path-input">
            <label htmlFor="filePath">CSV File Path:</label>
            <input
              type="text"
              id="filePath"
              value={filePath}
              onChange={handleFilePathChange}
              placeholder="Enter path to CSV file"
            />
            <button onClick={() => setLoading(true)}>Load</button>
          </div>

          <div className="file-upload">
            <label htmlFor="fileUpload">Or upload file:</label>
            <input
              type="file"
              id="fileUpload"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="view-selector">
          <button
            className={view === "relationships" ? "active" : ""}
            onClick={() => setView("relationships")}
          >
            Address Relationships
          </button>
          <button
            className={view === "timeseries" ? "active" : ""}
            onClick={() => setView("timeseries")}
          >
            Time Series Analysis
          </button>
          <button
            className={view === "scripttypes" ? "active" : ""}
            onClick={() => setView("scripttypes")}
          >
            Script Types
          </button>
          <button
            className={view === "topaddresses" ? "active" : ""}
            onClick={() => setView("topaddresses")}
          >
            Top Addresses
          </button>
          <button
            className={view === "correlation" ? "active" : ""}
            onClick={() => setView("correlation")}
          >
            Data Correlation
          </button>
          <button
            className={view === "scatter" ? "active" : ""}
            onClick={() => setView("scatter")}
          >
            Scatter Analysis
          </button>
        </div>
      </header>

      <main>
        {/* Existing visualization views remain the same */}
        {view === "relationships" && (
          <div className="visualization network-visualization">
            <h2>Address Relationship Network</h2>
            <p>
              Showing transaction relationships between top Bitcoin addresses.
              Larger nodes represent addresses with higher transaction volumes.
            </p>
            <div className="chart-container">
              {networkData.nodes.length > 0 ? (
                <ResponsiveNetwork
                  data={networkData}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  repulsivity={6}
                  iterations={60}
                  nodeColor={(node) => node.color}
                  nodeBorderWidth={1}
                  nodeBorderColor={{
                    from: "color",
                    modifiers: [["darker", 0.8]],
                  }}
                  linkThickness={(link) => link.width}
                  linkColor={{ from: "source.color" }}
                  motionConfig="gentle"
                  onClick={(node) => setSelectedAddress(node.id as string)}
                />
              ) : (
                <div className="no-data">No relationship data available</div>
              )}
            </div>
            {selectedAddress && (
              <div className="node-details">
                <h3>Address Details: {selectedAddress}</h3>
                <p>
                  Total transactions:{" "}
                  {
                    transactions.filter(
                      (tx) =>
                        (tx.sender_address &&
                          tx.sender_address.includes(selectedAddress)) ||
                        tx.receiver_address === selectedAddress
                    ).length
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {view === "timeseries" && (
          <div className="visualization time-series-visualization">
            <h2>Transaction Activity Over Time</h2>
            <div className="chart-container">
              {timeSeriesData[0]?.data.length > 0 ? (
                <ResponsiveLine
                  data={timeSeriesData}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "time", format: "%Y-%m-%dT%H:%M:%S.%LZ" }}
                  xFormat="time:%Y-%m-%d %H:%M"
                  yScale={{ type: "linear", min: "auto", max: "auto" }}
                  axisBottom={{
                    format: "%b %d %H:%M",
                    tickValues: 5,
                    legend: "Time",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    legend: "Count / Volume / Fee",
                    legendOffset: -40,
                    legendPosition: "middle",
                  }}
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              ) : (
                <div className="no-data">No time series data available</div>
              )}
            </div>
          </div>
        )}

        {view === "scripttypes" && (
          <div className="visualization script-types-visualization">
            <h2>Script Type Distribution</h2>
            <div className="chart-container">
              {scriptTypeData.length > 0 ? (
                <ResponsivePie
                  data={scriptTypeData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: "#999",
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#000",
                          },
                        },
                      ],
                    },
                  ]}
                />
              ) : (
                <div className="no-data">No script type data available</div>
              )}
            </div>
          </div>
        )}

        {view === "topaddresses" && (
          <div className="visualization top-addresses-visualization">
            <h2>Top Addresses by Transaction Volume</h2>
            <div className="chart-container">
              {topAddresses.length > 0 ? (
                <ResponsiveBar
                  data={topAddresses.map((a) => ({
                    address:
                      a.address.length > 10
                        ? a.address.substring(0, 10) + "..."
                        : a.address,
                    value: a.value,
                  }))}
                  keys={["value"]}
                  indexBy="address"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={{ scheme: "nivo" }}
                  defs={[
                    {
                      id: "dots",
                      type: "patternDots",
                      background: "inherit",
                      color: "#38bcb2",
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: "lines",
                      type: "patternLines",
                      background: "inherit",
                      color: "#eed312",
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10,
                    },
                  ]}
                  fill={[
                    {
                      match: {
                        id: "value",
                      },
                      id: "dots",
                    },
                  ]}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: "Address",
                    legendPosition: "middle",
                    legendOffset: 45,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Transaction Volume (BTC)",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                  role="application"
                  ariaLabel="Transaction volume by address"
                  onClick={(data) => {
                    const fullAddress = topAddresses.find((addr) =>
                      addr.address.startsWith(
                        data.data.address.substring(0, 10)
                      )
                    )?.address;
                    if (fullAddress) setSelectedAddress(fullAddress);
                  }}
                />
              ) : (
                <div className="no-data">No top address data available</div>
              )}
            </div>
            {selectedAddress && (
              <div className="node-details">
                <h3>Address Details: {selectedAddress}</h3>
                <p>
                  Total transactions:{" "}
                  {
                    transactions.filter(
                      (tx) =>
                        (tx.sender_address &&
                          tx.sender_address.includes(selectedAddress)) ||
                        tx.receiver_address === selectedAddress
                    ).length
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* New correlation heatmap view */}
        {view === "correlation" && (
          <div className="visualization correlation-visualization">
            <h2>Transaction Parameter Correlation</h2>
            <p>
              Heatmap showing Pearson correlation coefficients between
              transaction parameters. Values close to 1 indicate strong positive
              correlation, values close to -1 indicate strong negative
              correlation, and values near 0 indicate little to no correlation.
            </p>
            <div className="chart-container">
              {correlationData.length > 0 ? (
                <ResponsiveHeatMap
                  data={correlationData}
                  margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
                  valueFormat=".2f"
                  axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: "",
                    legendOffset: 46,
                  }}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: 36,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: -72,
                  }}
                  colors={{
                    type: "diverging",
                    scheme: "red_blue",
                    divergeAt: 0.5,
                    minValue: -1,
                    maxValue: 1,
                  }}
                  emptyColor="#555555"
                  hoverTarget="cell"
                  cellOpacity={1}
                  cellBorderColor={{
                    from: "color",
                    modifiers: [["darker", 0.4]],
                  }}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.8]],
                  }}
                  legends={[
                    {
                      anchor: "bottom",
                      translateX: 0,
                      translateY: 30,
                      length: 140,
                      thickness: 12,
                      direction: "row",
                      tickPosition: "after",
                      tickSize: 3,
                      tickSpacing: 4,
                      tickOverlap: false,
                      tickFormat: ".2f",
                      title: "Correlation Coefficient →",
                      titleAlign: "start",
                      titleOffset: 4,
                    },
                  ]}
                  annotations={[
                    {
                      type: "rect",
                      match: { id: "value", value: "value" },
                      noteTextOffset: { x: -10, y: -10 },
                      offset: 5,
                      noteWidth: 120,
                      noteHeight: 30,
                      noteTextColor: "black",
                    },
                  ]}
                />
              ) : (
                <div className="no-data">No correlation data available</div>
              )}
            </div>
          </div>
        )}

        {/* Scatter plot view */}
        {view === "scatter" && (
          <div className="visualization scatter-visualization">
            <h2>Transaction Fee Relationships</h2>
            <p>
              Scatter plots showing the relationship between transaction fee and
              other parameters.
            </p>
            <div className="chart-container">
              {scatterData.length > 0 ? (
                <ResponsiveScatterPlot
                  data={scatterData}
                  margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                  xScale={{ type: "linear", min: 0, max: "auto" }}
                  yScale={{ type: "linear", min: 0, max: "auto" }}
                  blendMode="multiply"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    orient: "bottom",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Transaction Size/Value",
                    legendPosition: "middle",
                    legendOffset: 46,
                  }}
                  axisLeft={{
                    orient: "left",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Fee",
                    legendPosition: "middle",
                    legendOffset: -60,
                  }}
                  colors={{ scheme: "category10" }}
                  nodeSize={{
                    key: "data.size",
                    values: [4, 20],
                    sizes: [6, 20],
                  }}
                  useMesh={true}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 130,
                      translateY: 0,
                      itemWidth: 100,
                      itemHeight: 12,
                      itemsSpacing: 5,
                      itemDirection: "left-to-right",
                      symbolSize: 12,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              ) : (
                <div className="no-data">No scatter plot data available</div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>Created for blockchain data exploration and analysis</p>
        <p>Data loaded: {transactions.length} transactions</p>
      </footer>
    </div>
  );
};

export default VApp;
