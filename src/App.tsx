import { FC, useState, useEffect } from "react";
import "./index.css";
import { Routes, Route, useNavigate } from "react-router-dom"; // No BrowserRouter here
import Navbar from "./components/Navbar";
import AddressExplorer from "./cq/address-explorer";
import DarkwebDashboard from "./cq/darkweb-dashboard";
import AddressRiskView from "./cq/darkweb-address-risk";
import BlockchainAnalyticsDashboard from "./cq/dashboard-component";
import EntityProfile from "./cq/entity-profile";
import TransactionExplorer from "./cq/transaction-explorer";
import ChainQuasarDashboard from "./cq/index";
import ChainQuasarExecutiveDashboard from "./cq/chainquasar-executive-dashboard";
import SignUpPage from "./components/SignUp";
import LoginPage from "./components/Login";


interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}


const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = ({ children, onLogout }) => (
  <div className="flex h-screen overflow-hidden">
    <Navbar onLogout={onLogout} />
    <div className="flex-1 overflow-auto">
      <div className="px-0 py-0">{children}</div>
    </div>
  </div>
);

const App: FC = function () {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("authToken");
    return !!token;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (userData: any) => {
    const token = userData.token;
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    navigate("/"); 
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login"); 
  };

  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage onSignUp={() => {}} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <BlockchainAnalyticsDashboard />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/address"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <AddressExplorer />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/darkweb"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <DarkwebDashboard />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/risk"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <AddressRiskView />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/entity"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <EntityProfile />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/transaction"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <TransactionExplorer />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/cq"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <ChainQuasarDashboard />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/executive"
        element={
          <AuthenticatedLayout onLogout={handleLogout}>
            <ChainQuasarExecutiveDashboard />
          </AuthenticatedLayout>
        }
      />
    </Routes>
  );
};

export default App;