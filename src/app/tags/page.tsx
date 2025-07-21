"use client";

import { ArrowLeft, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminLogin from "../../components/AdminLogin";
import Navbar from "../../components/Navbar";
import TagDefinitionCard from "../../components/TagDefinitionCard";
import TagDefinitionForm from "../../components/TagDefinitionForm";
import { useI18n } from "../../i18n/context";
import { AdminState, TagDefinition } from "../../types/content";
import { deleteTagDefinition, fetchTagDefinitions } from "../../utils/supabase";

export default function TagsPage() {
  const { t } = useI18n();
  const [adminState, setAdminState] = useState<AdminState>({
    isLoggedIn: false,
    isAdmin: false,
    password: "",
  });
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagDefinition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Simple admin password (you can change this)
  const ADMIN_PASSWORD = "admin123";

  // Load tag definitions and check admin authentication on component mount
  useEffect(() => {
    loadTagDefinitions();
    // Check if admin is already logged in
    const savedPassword = localStorage.getItem("admin_password");
    if (savedPassword === ADMIN_PASSWORD) {
      setAdminState({
        isLoggedIn: true,
        isAdmin: true,
        password: savedPassword,
      });
    }
  }, []);

  // Filter tags based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTags(tagDefinitions);
    } else {
      const filtered = tagDefinitions.filter((tag) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          tag.code.toLowerCase().includes(searchLower) ||
          tag.name_en.toLowerCase().includes(searchLower) ||
          tag.name_fr.toLowerCase().includes(searchLower) ||
          (tag.category && tag.category.toLowerCase().includes(searchLower))
        );
      });
      setFilteredTags(filtered);
    }
  }, [searchTerm, tagDefinitions]);

  const loadTagDefinitions = async () => {
    setIsLoading(true);
    try {
      const tags = await fetchTagDefinitions();
      setTagDefinitions(tags);
    } catch (error) {
      console.error("Error loading tag definitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (tag: TagDefinition) => {
    setTagDefinitions((prev) => [tag, ...prev]);
    setShowForm(false);
    setEditingTag(null);
  };

  const handleEditTag = (tag: TagDefinition) => {
    setTagDefinitions((prev) => prev.map((t) => (t.id === tag.id ? tag : t)));
    setShowForm(false);
    setEditingTag(null);
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const success = await deleteTagDefinition(id);
      if (success) {
        setTagDefinitions((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(t("tags.messages.failedToDeleteTag"));
      }
    } catch (error) {
      console.error("Error deleting tag definition:", error);
      alert(t("tags.messages.failedToDeleteTag"));
    }
  };

  const handleEditClick = (tag: TagDefinition) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingTag(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTag(null);
  };

  // Check if user is admin
  const isAdmin = adminState.isLoggedIn && adminState.isAdmin;

  // Admin login handlers
  const handleAdminLogin = (password: string) => {
    // Simple admin check - in a real app, this would be more secure
    if (password === ADMIN_PASSWORD) {
      setAdminState({ isLoggedIn: true, isAdmin: true, password });
      localStorage.setItem("admin_password", password);
      setShowAdminLogin(false);
    } else {
      alert("Incorrect password");
    }
  };

  const handleAdminLogout = () => {
    setAdminState({ isLoggedIn: false, isAdmin: false, password: "" });
    localStorage.removeItem("admin_password");
  };

  const handleShowAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAdmin={isAdmin}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        onShowAdminLogin={handleShowAdminLogin}
        showAdminLogin={showAdminLogin}
        onCloseAdminLogin={handleCloseAdminLogin}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("tags.title")}
          </h1>
          <p className="text-gray-600">{t("tags.description")}</p>
        </div>

        {/* Admin Login */}
        {!adminState.isLoggedIn && (
          <div className="mb-6">
            <AdminLogin
              onLogin={handleAdminLogin}
              onCancel={handleCloseAdminLogin}
            />
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={t("tags.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddClick}
              className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              {t("tags.addNewTag")}
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">{t("common.loading")}</div>
          </div>
        )}

        {/* Tag Definitions Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTags.map((tag) => (
              <TagDefinitionCard
                key={tag.id}
                tag={tag}
                onDelete={isAdmin ? handleDeleteTag : undefined}
                onEdit={isAdmin ? handleEditClick : undefined}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTags.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm ? t("tags.noTagsFoundSearch") : t("tags.noTagsFound")}
            </div>
            {isAdmin && !searchTerm && (
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                {t("tags.addNewTag")}
              </button>
            )}
          </div>
        )}

        {/* Tag Definition Form Modal */}
        {showForm && (
          <TagDefinitionForm
            onAdd={handleAddTag}
            onEdit={handleEditTag}
            onClose={handleCloseForm}
            editingTag={editingTag}
          />
        )}
      </div>
    </div>
  );
}
