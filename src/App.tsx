import { FC } from "react";
import "./index.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar"; // Note: Still importing as Navbar but using as Sidebar
import AddressExplorer from "./cq/address-explorer";
import DarkwebDashboard from "./cq/darkweb-dashboard";
import AddressRiskView from "./cq/darkweb-address-risk";
import BlockchainAnalyticsDashboard from "./cq/dashboard-component";
import EntityProfile from "./cq/entity-profile";
import TransactionExplorer from "./cq/transaction-explorer";
import ChainQuasarDashboard from "./cq/index";
import ChainQuasarExecutiveDashboard from "./cq/chainquasar-executive-dashboard";

const App: FC = function () {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar component */}
        <Navbar />

        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <div className="px-0 py-0">
            <Routes>
              <Route path="/" element={<BlockchainAnalyticsDashboard />} />
              <Route path="/address" element={<AddressExplorer />} />
              <Route path="/darkweb" element={<DarkwebDashboard />} />
              <Route path="/risk" element={<AddressRiskView />} />
              <Route path="/entity" element={<EntityProfile />} />
              <Route path="/transaction" element={<TransactionExplorer />} />
              <Route path="/cq" element={<ChainQuasarDashboard />} />
              <Route
                path="/executive"
                element={<ChainQuasarExecutiveDashboard />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
