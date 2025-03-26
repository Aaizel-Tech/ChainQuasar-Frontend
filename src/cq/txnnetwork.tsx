import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Mock data for the transaction network
const mockNetworkData = {
  nodes: [
    {
      id: "main",
      name: "Target Wallet",
      type: "wallet",
      risk: "medium",
      size: 15,
    },
    { id: "e1", name: "Binance", type: "exchange", risk: "low", size: 12 },
    { id: "e2", name: "Coinbase", type: "exchange", risk: "low", size: 12 },
    { id: "m1", name: "Tornado Cash", type: "mixer", risk: "high", size: 10 },
    {
      id: "h1",
      name: "Suspected Wallet 1",
      type: "highrisk",
      risk: "high",
      size: 8,
    },
    {
      id: "h2",
      name: "Suspected Wallet 2",
      type: "highrisk",
      risk: "severe",
      size: 9,
    },
    {
      id: "h3",
      name: "Suspected Wallet 3",
      type: "highrisk",
      risk: "high",
      size: 8,
    },
    { id: "w1", name: "User Wallet 1", type: "wallet", risk: "low", size: 6 },
    { id: "w2", name: "User Wallet 2", type: "wallet", risk: "low", size: 7 },
    {
      id: "w3",
      name: "User Wallet 3",
      type: "wallet",
      risk: "medium",
      size: 6,
    },
    { id: "w4", name: "User Wallet 4", type: "wallet", risk: "low", size: 5 },
    {
      id: "w5",
      name: "User Wallet 5",
      type: "wallet",
      risk: "medium",
      size: 6,
    },
    { id: "e3", name: "Kraken", type: "exchange", risk: "low", size: 10 },
    { id: "m2", name: "Wasabi Wallet", type: "mixer", risk: "medium", size: 8 },
  ],
  links: [
    { source: "main", target: "e1", value: 3.2, direction: "outgoing" },
    { source: "e2", target: "main", value: 2.8, direction: "incoming" },
    { source: "main", target: "m1", value: 1.5, direction: "outgoing" },
    { source: "m1", target: "h1", value: 0.8, direction: "outgoing" },
    { source: "m1", target: "h2", value: 0.7, direction: "outgoing" },
    { source: "main", target: "w1", value: 0.5, direction: "outgoing" },
    { source: "main", target: "w2", value: 0.3, direction: "outgoing" },
    { source: "w3", target: "main", value: 0.6, direction: "incoming" },
    { source: "e1", target: "h3", value: 1.2, direction: "outgoing" },
    { source: "h3", target: "main", value: 1.0, direction: "incoming" },
    { source: "w4", target: "main", value: 0.4, direction: "incoming" },
    { source: "main", target: "w5", value: 0.3, direction: "outgoing" },
    { source: "e3", target: "main", value: 2.5, direction: "incoming" },
    { source: "main", target: "m2", value: 0.9, direction: "outgoing" },
    { source: "m2", target: "h2", value: 0.4, direction: "outgoing" },
  ],
};

// Network data for each hop level
const networkHopLevels = {
  "1": {
    nodes: mockNetworkData.nodes.filter(
      (node) =>
        node.id === "main" ||
        mockNetworkData.links.some(
          (link) =>
            (link.source === "main" && link.target === node.id) ||
            (link.target === "main" && link.source === node.id)
        )
    ),
    links: mockNetworkData.links.filter(
      (link) => link.source === "main" || link.target === "main"
    ),
  },
  "2": {
    nodes: mockNetworkData.nodes.filter(
      (node) =>
        node.id === "main" ||
        mockNetworkData.links.some(
          (link) =>
            (link.source === "main" && link.target === node.id) ||
            (link.target === "main" && link.source === node.id) ||
            mockNetworkData.links.some(
              (innerLink) =>
                (innerLink.source === link.target &&
                  innerLink.target === node.id) ||
                (innerLink.target === link.source &&
                  innerLink.source === node.id)
            )
        )
    ),
    links: mockNetworkData.links.filter((link) => {
      if (link.source === "main" || link.target === "main") return true;

      return mockNetworkData.links.some(
        (innerLink) =>
          (innerLink.source === "main" &&
            (innerLink.target === link.source ||
              innerLink.target === link.target)) ||
          (innerLink.target === "main" &&
            (innerLink.source === link.source ||
              innerLink.source === link.target))
      );
    }),
  },
  "3": mockNetworkData, // All data
};

const NetworkVisualizationWidget = () => {
  const svgRef = useRef(null);
  const [hopLevel, setHopLevel] = useState("2");
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Function to handle hop level change
  const handleHopChange = (level) => {
    setHopLevel(level);
  };

  // Create and update the network visualization
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Get current network data based on hop level
    const currentNetworkData = networkHopLevels[hopLevel];

    // Define container dimensions
    const containerWidth = svgRef.current.clientWidth;
    const containerHeight = isFullscreen ? window.innerHeight * 0.8 : 230;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Create color scale for node types
    const typeColorScale = d3
      .scaleOrdinal()
      .domain(["exchange", "mixer", "highrisk", "wallet"])
      .range(["#1890ff", "#722ed1", "#f5222d", "#52c41a"]);

    // Define arrow markers for directed links
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create simulation
    const simulation = d3
      .forceSimulation(currentNetworkData.nodes)
      .force(
        "link",
        d3
          .forceLink(currentNetworkData.links)
          .id((d) => d.id)
          .distance((d) => 80 / d.value)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.size * 2)
      );

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(currentNetworkData.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("marker-end", (d) =>
        d.direction === "outgoing" ? "url(#arrowhead)" : null
      )
      .attr("marker-start", (d) =>
        d.direction === "incoming" ? "url(#arrowhead)" : null
      );

    // Create nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(currentNetworkData.nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => typeColorScale(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Add node labels
    const nodeLabels = svg
      .append("g")
      .selectAll("text")
      .data(currentNetworkData.nodes)
      .enter()
      .append("text")
      .attr("dx", (d) => d.size + 5)
      .attr("dy", ".35em")
      .text((d) =>
        d.id === "main" ? d.name : containerWidth > 500 ? d.name : ""
      )
      .attr("font-size", "10px")
      .attr("pointer-events", "none");

    // Update simulation on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .attr("cx", (d) => {
          return (d.x = Math.max(
            d.size,
            Math.min(containerWidth - d.size, d.x)
          ));
        })
        .attr("cy", (d) => {
          return (d.y = Math.max(
            d.size,
            Math.min(containerHeight - d.size, d.y)
          ));
        });

      nodeLabels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Resize handler
    const handleResize = () => {
      if (isFullscreen) {
        svg.attr("height", window.innerHeight * 0.8);
        simulation
          .force(
            "center",
            d3.forceCenter(containerWidth / 2, window.innerHeight * 0.4)
          )
          .restart();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
    };
  }, [hopLevel, isFullscreen]);

  return (
    <div
      className={`bg-white rounded-lg shadow ${
        isFullscreen ? "fixed inset-0 z-50 m-4" : "p-4"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transaction Network Analysis</h2>
        <div className="flex space-x-2">
          <button
            className={`${
              hopLevel === "1"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            } px-2 py-1 rounded text-xs`}
            onClick={() => handleHopChange("1")}
          >
            1 Hop
          </button>
          <button
            className={`${
              hopLevel === "2"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            } px-2 py-1 rounded text-xs`}
            onClick={() => handleHopChange("2")}
          >
            2 Hops
          </button>
          <button
            className={`${
              hopLevel === "3"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            } px-2 py-1 rounded text-xs`}
            onClick={() => handleHopChange("3")}
          >
            3 Hops
          </button>
        </div>
      </div>

      <div
        className="border rounded-lg p-2 bg-gray-50"
        style={{ height: isFullscreen ? "80vh" : "230px" }}
      >
        <svg ref={svgRef} className="w-full h-full"></svg>

        {selectedNode && (
          <div
            className="absolute bg-white border rounded-lg p-3 shadow-lg"
            style={{ bottom: "10px", right: "10px", maxWidth: "250px" }}
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{selectedNode.name}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="text-sm mt-2">
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {selectedNode.type.charAt(0).toUpperCase() +
                  selectedNode.type.slice(1)}
              </div>
              <div>
                <span className="text-gray-500">Risk:</span>{" "}
                {selectedNode.risk.charAt(0).toUpperCase() +
                  selectedNode.risk.slice(1)}
              </div>
              <div className="mt-2">
                <button className="text-blue-600 text-xs">
                  View Transactions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-right">
        <button className="text-blue-600 text-sm" onClick={toggleFullscreen}>
          {isFullscreen ? "Collapse View ↓" : "Expand View →"}
        </button>
      </div>

      {isFullscreen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white p-3 rounded-lg shadow flex justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-sm">Exchange</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-1"></div>
              <span className="text-sm">Mixer</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-1"></div>
              <span className="text-sm">High Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm">Wallet</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkVisualizationWidget;
