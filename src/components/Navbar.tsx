import {
  ChevronDown,
  Download,
  Lock,
  LogOut,
  Settings,
  User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "../i18n/context";
import AdminLogin from "./AdminLogin";
import LanguageSelector from "./LanguageSelector";

interface NavbarProps {
  isAdmin: boolean;
  onAdminLogin: (password: string) => void;
  onAdminLogout: () => void;
  onShowAdminLogin: () => void;
  showAdminLogin: boolean;
  onCloseAdminLogin: () => void;
  onExportToMarkdown?: () => void;
}

export default function Navbar({
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  onShowAdminLogin,
  showAdminLogin,
  onCloseAdminLogin,
  onExportToMarkdown,
}: NavbarProps) {
  const { t } = useI18n();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleSettingsClick = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSettingsDropdown(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D6</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 ">
                {t("navigation.title")}
              </h1>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? t("navigation.description")
                  : t("navigation.descriptionNonAdmin")}
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Settings Dropdown */}
            <div className="relative">
              {isAdmin ? (
                <div className="relative">
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showSettingsDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Settings Dropdown Menu */}
                  {showSettingsDropdown && (
                    <div
                      className="absolute right-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 pb-0 z-50"
                      onClick={handleBackdropClick}
                    >
                      {/* Admin Status */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">
                            {t("admin.adminMode")}
                          </span>
                        </div>
                      </div>

                      {/* Settings Options */}
                      <div className="pt-1">
                        <Link
                          href="/tags"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowSettingsDropdown(false)}
                        >
                          <Settings className="w-4 h-4 text-purple-600" />
                          <span>Tag Management</span>
                        </Link>

                        {onExportToMarkdown && (
                          <button
                            onClick={() => {
                              onExportToMarkdown();
                              setShowSettingsDropdown(false);
                            }}
                            className="flex items-center cursor-pointer gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Download className="w-4 h-4 text-green-600" />
                            <span>{t("admin.exportMD")}</span>
                          </button>
                        )}


                        <button
                          onClick={() => {
                            onAdminLogout();
                            setShowSettingsDropdown(false);
                          }}
                          className="flex items-center cursor-pointer gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t("admin.logoutButton")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onShowAdminLogin}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  title={t("admin.login")}
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("admin.login")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onLogin={onAdminLogin} onCancel={onCloseAdminLogin} />
      )}

      {/* Backdrop for dropdown */}
      {showSettingsDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettingsDropdown(false)}
        />
      )}
    </nav>
  );
}
