import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, ChevronRight, LogOut } from "lucide-react"; // Added LogOut icon

interface NavLinkProps {
  to: string;
  label: string;
  current: boolean;
  icon?: React.ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}

const NavLink: FC<NavLinkProps> = ({
  to,
  label,
  current,
  icon,
  collapsed,
  onClick,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`px-4 py-3 rounded-lg text-sm font-medium w-full flex items-center gap-3 transition-all duration-200 ${
      current
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-300 hover:bg-indigo-500/20 hover:text-white"
    }`}
  >
    {icon && <span className="text-lg">{icon}</span>}
    {!collapsed && <span>{label}</span>}
  </Link>
);

type Language = "en" | "ru";

interface NavbarProps {
  onLogout: () => void; // Added onLogout prop
}

const Navbar: FC<NavbarProps> = ({ onLogout }) => {
  const [darkMode] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ru" : "en");
  };

  // Define language-specific labels
  const translations = {
    en: {
      dashboard: "Dashboard",
      addressExplorer: "Address Explorer",
      darkwebMonitor: "Darkweb Monitor",
      riskAssessment: "Risk Assessment",
      entityProfiles: "Entity Profiles",
      transactionExplorer: "Transaction Explorer",
      chainQuasarDashboard: "ChainQuasar Dashboard",
      executiveDashboard: "Executive Dashboard",
      language: "Language",
      theme: "Theme",
      logout: "Logout",
    },
    ru: {
      dashboard: "Панель управления",
      addressExplorer: "Обозреватель адресов",
      darkwebMonitor: "Мониторинг даркнета",
      riskAssessment: "Оценка рисков",
      entityProfiles: "Профили организаций",
      transactionExplorer: "Обозреватель транзакций",
      chainQuasarDashboard: "Панель ChainQuasar",
      executiveDashboard: "Панель руководителя",
      language: "Язык",
      theme: "Тема",
      logout: "Выйти",
    },
  };

  const t = translations[language];

  const navLinks = [
    {
      path: "/",
      label: t.dashboard,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      path: "/address",
      label: t.addressExplorer,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      path: "/darkweb",
      label: t.darkwebMonitor,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      path: "/risk",
      label: t.riskAssessment,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      ),
    },
    {
      path: "/entity",
      label: t.entityProfiles,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      path: "/transaction",
      label: t.transactionExplorer,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      path: "/cq",
      label: t.chainQuasarDashboard,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M20 4v5l-5 5" />
          <path d="M19.3 15.7a9 9 0 1 1-12.6-12.6" />
        </svg>
      ),
    },
    {
      path: "/executive",
      label: t.executiveDashboard,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col h-screen relative group`}
    >
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-indigo-600 text-white rounded-full p-1 shadow-md hover:bg-indigo-700 transition-colors z-10"
      >
        <ChevronRight
          className={`h-4 w-4 transition-transform duration-300 ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </button>

      {/* Logo section */}
      <div className="flex items-center p-4 border-b border-gray-700/50">
        <svg
          className="flex-shrink-0"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#6366f1" }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m16.2 7.8-2.3 6.1-6.1 2.3 2.3-6.1z" />
        </svg>
        {!collapsed && (
          <span
            className={`ml-3 text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            ChainQuasar
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <div className="py-4 space-y-1 px-3 flex-grow overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            label={link.label}
            icon={link.icon}
            current={location.pathname === link.path}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* Settings & Tools */}
      <div
        className={`p-3 border-t border-gray-700/50 ${
          collapsed ? "" : "space-y-3"
        }`}
      >
        {/* Language Toggle */}
        {/* <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } px-4 py-3 rounded-lg text-gray-300 hover:bg-indigo-500/20 cursor-pointer`}
          onClick={toggleLanguage}
        >
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5" />
            {!collapsed && (
              <span>{language === "en" ? "English" : "Русский"}</span>
            )}
          </div>
        </div> */}

        {/* Logout Button */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } px-4 py-3 rounded-lg text-gray-300 hover:bg-indigo-500/20 cursor-pointer`}
          onClick={onLogout}
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>{t.logout}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
