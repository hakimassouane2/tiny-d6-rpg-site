import { Download, Eye, EyeOff, Lock, LogOut, User } from "lucide-react";
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
  showHiddenContent?: boolean;
  onToggleHiddenContent?: () => void;
  onExportToMarkdown?: () => void;
}

export default function Navbar({
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  onShowAdminLogin,
  showAdminLogin,
  onCloseAdminLogin,
  showHiddenContent,
  onToggleHiddenContent,
  onExportToMarkdown,
}: NavbarProps) {
  const { t } = useI18n();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D6</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {t("navigation.title")}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {t("navigation.description")}
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Admin Controls */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("admin.adminMode")}
                    </span>
                  </div>
                  {onToggleHiddenContent && (
                    <button
                      onClick={onToggleHiddenContent}
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      title={
                        showHiddenContent
                          ? t("admin.hideHidden")
                          : t("admin.showHidden")
                      }
                    >
                      {showHiddenContent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {showHiddenContent
                          ? t("admin.hideHidden")
                          : t("admin.showHidden")}
                      </span>
                    </button>
                  )}
                  {onExportToMarkdown && (
                    <button
                      onClick={onExportToMarkdown}
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      title={t("admin.exportMD")}
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {t("admin.exportMD")}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={onAdminLogout}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    title={t("admin.logout")}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("admin.logoutButton")}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onShowAdminLogin}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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
    </nav>
  );
}
