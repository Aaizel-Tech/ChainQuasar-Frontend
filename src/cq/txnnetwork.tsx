import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Maximize2, Minimize2, Info, X } from "lucide-react";

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
  const [showLegend, setShowLegend] = useState(true);

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
    const containerHeight = isFullscreen ? window.innerHeight * 0.8 : 180;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Add a subtle grid background pattern
    const defs = svg.append("defs");

    // Create gradient for background
    const gradient = defs
      .append("linearGradient")
      .attr("id", "network-bg-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0a0f29")
      .attr("stop-opacity", 0.02);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#111827")
      .attr("stop-opacity", 0.08);

    // Add background rectangle with gradient
    svg
      .append("rect")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "url(#network-bg-gradient)");

    // Create grid pattern
    defs
      .append("pattern")
      .attr("id", "grid")
      .attr("width", 20)
      .attr("height", 20)
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 20 0 L 0 0 0 20")
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", "0.5")
      .attr("stroke-opacity", "0.2");

    // Add grid overlay
    svg
      .append("rect")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "url(#grid)");

    // Create glow effect for nodes
    const nodeGlow = defs
      .append("filter")
      .attr("id", "node-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    nodeGlow
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "blur");

    nodeGlow
      .append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    // Create color scale for node types with blockchain theme colors
    const typeColorScale = d3
      .scaleOrdinal()
      .domain(["exchange", "mixer", "highrisk", "wallet"])
      .range(["#3498db", "#9b59b6", "#e74c3c", "#2ecc71"]);

    // Risk color scale
    const riskColorScale = d3
      .scaleOrdinal()
      .domain(["low", "medium", "high", "severe"])
      .range(["#2ecc71", "#f39c12", "#e74c3c", "#c0392b"]);

    // Define arrow markers for directed links with better styling
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
      .attr("fill", "#64748b");

    // Create simulation with improved physics
    const simulation = d3
      .forceSimulation(currentNetworkData.nodes)
      .force(
        "link",
        d3
          .forceLink(currentNetworkData.links)
          .id((d) => d.id)
          .distance((d) => 100 / (d.value * 0.8))
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.size * 2.2)
      );

    // Create link groups for better styling
    const linkGroup = svg.append("g").attr("class", "links");

    // Create links with gradient effect
    const link = linkGroup
      .selectAll("line")
      .data(currentNetworkData.links)
      .enter()
      .append("line")
      .attr("stroke", "#64748b")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 1.2)
      .attr("stroke-dasharray", (d) =>
        d.direction === "outgoing" ? "4, 2" : null
      )
      .attr("marker-end", (d) =>
        d.direction === "outgoing" ? "url(#arrowhead)" : null
      )
      .attr("marker-start", (d) =>
        d.direction === "incoming" ? "url(#arrowhead)" : null
      );

    // Add transaction amount labels to links
    const linkLabels = linkGroup
      .selectAll("text")
      .data(currentNetworkData.links)
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("font-size", "9px")
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "middle")
      .text((d) => `${d.value} ETH`);

    // Create nodes with better styling
    const nodeGroup = svg.append("g").attr("class", "nodes");

    // Add node highlight rings
    const nodeRings = nodeGroup
      .selectAll(".node-ring")
      .data(currentNetworkData.nodes)
      .enter()
      .append("circle")
      .attr("class", "node-ring")
      .attr("r", (d) => d.size * 1.4)
      .attr("fill", "none")
      .attr("stroke", (d) => typeColorScale(d.type))
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2);

    // Add main nodes
    const node = nodeGroup
      .selectAll(".node")
      .data(currentNetworkData.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => typeColorScale(d.type))
      .attr("stroke", (d) => riskColorScale(d.risk))
      .attr("stroke-width", 2)
      .attr("filter", (d) => (d.id === "main" ? "url(#node-glow)" : null))
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size * 1.2);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("r", d.size);
      })
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

    // Add node labels with better styling
    const nodeLabels = nodeGroup
      .selectAll("text")
      .data(currentNetworkData.nodes)
      .enter()
      .append("text")
      .attr("dx", (d) => d.size + 5)
      .attr("dy", ".35em")
      .text((d) =>
        d.id === "main" ? d.name : containerWidth > 500 ? d.name : ""
      )
      .attr("font-size", "11px")
      .attr("fill", "#e2e8f0")
      .attr("pointer-events", "none")
      .attr("text-shadow", "0 1px 3px rgba(0,0,0,0.7)");

    // Update simulation on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      linkLabels
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

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

      nodeRings.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

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
      className={`bg-slate-900 rounded-xl shadow-lg border border-slate-800 ${
        isFullscreen ? "fixed inset-0 z-50 m-0 rounded-none" : "h-80"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <h2 className="text-lg font-semibold text-white">
            Transaction Network Analysis
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                hopLevel === "1"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
              onClick={() => handleHopChange("1")}
            >
              1 Hop
            </button>
            <button
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                hopLevel === "2"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
              onClick={() => handleHopChange("2")}
            >
              2 Hops
            </button>
            <button
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                hopLevel === "3"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
              onClick={() => handleHopChange("3")}
            >
              3 Hops
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              className="p-1 text-slate-400 hover:text-white transition-colors rounded-md"
              onClick={() => setShowLegend(!showLegend)}
              title="Toggle Legend"
            >
              <Info size={18} />
            </button>
            <button
              className="p-1 text-slate-400 hover:text-white transition-colors rounded-md"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative"
        style={{ height: isFullscreen ? "calc(100vh - 190px)" : "280px" }}
      >
        <svg ref={svgRef} className="w-full h-half"></svg>

        {selectedNode && (
          <div
            className="absolute bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg text-white"
            style={{ bottom: "20px", right: "20px", maxWidth: "280px" }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      selectedNode.type === "exchange"
                        ? "#3498db"
                        : selectedNode.type === "mixer"
                        ? "#9b59b6"
                        : selectedNode.type === "highrisk"
                        ? "#e74c3c"
                        : "#2ecc71",
                  }}
                ></div>
                <h3 className="font-medium">{selectedNode.name}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-700">
                <span className="text-slate-400">Type</span>
                <span className="font-medium">
                  {selectedNode.type.charAt(0).toUpperCase() +
                    selectedNode.type.slice(1)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700">
                <span className="text-slate-400">Risk Level</span>
                <span
                  className={`font-medium ${
                    selectedNode.risk === "high" ||
                    selectedNode.risk === "severe"
                      ? "text-red-400"
                      : selectedNode.risk === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {selectedNode.risk.charAt(0).toUpperCase() +
                    selectedNode.risk.slice(1)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700">
                <span className="text-slate-400">Connection Count</span>
                <span className="font-medium">
                  {
                    mockNetworkData.links.filter(
                      (link) =>
                        link.source === selectedNode.id ||
                        link.target === selectedNode.id ||
                        (typeof link.source === "object" &&
                          link.source.id === selectedNode.id) ||
                        (typeof link.target === "object" &&
                          link.target.id === selectedNode.id)
                    ).length
                  }
                </span>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs py-1 px-3 rounded-md flex-1">
                  View Transactions
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 transition-colors text-white text-xs py-1 px-3 rounded-md flex-1">
                  Track Address
                </button>
              </div>
            </div>
          </div>
        )}

        {showLegend && (
          <div className="absolute bottom-16 left-4 right-4">
            <div className="bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-700 flex flex-wrap justify-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-slate-300">Exchanges</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs text-slate-300">Mixers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-slate-300">High Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-slate-300">Wallets</span>
              </div>
              <div className="flex items-center ml-4 pl-4 border-l border-slate-700">
                <span className="text-xs text-slate-400">
                  Hover nodes for details
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkVisualizationWidget;
