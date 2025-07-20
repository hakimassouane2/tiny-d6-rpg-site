"use client";

import { Plus, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import AdminLogin from "../components/AdminLogin";
import ContentCard from "../components/ContentCard";
import Navbar from "../components/Navbar";
import TagAutocomplete from "../components/TagAutocomplete";
import { useI18n } from "../i18n/context";
import { getTagTranslation } from "../i18n/tags";
import {
  AdminState,
  Ancestry,
  ContentFormData,
  ContentType,
  D6Content,
} from "../types/content";
import { contentToMarkdown } from "../utils/markdown";
import {
  addContent,
  deleteContent,
  fetchContent,
  updateContent,
} from "../utils/supabase";

const CONTENT_TYPES: ContentType[] = ["trait", "object", "class", "ancestry"];

// Get content types based on admin status
const getContentTypesForUser = (isAdmin: boolean): ContentType[] => {
  if (isAdmin) {
    return CONTENT_TYPES;
  }
  return ["trait", "object", "class", "ancestry"];
};

interface ContentFormProps {
  onAdd: (content: D6Content) => void;
  onEdit?: (content: D6Content) => void;
  onClose: () => void;
  isAdmin: boolean;
  editingItem?: D6Content | null;
}

function ContentForm({
  onAdd,
  onEdit,
  onClose,
  isAdmin,
  editingItem,
}: ContentFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<ContentFormData>({
    name: "",
    type: "trait",
    description: "",
    rules: "",
    tags: "",
    is_hidden: false,
    base_hp: 0,
    base_ac: 0,
    base_trait: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingItem) {
      const ancestryItem = editingItem as Ancestry;
      setFormData({
        name: editingItem.name,
        type: editingItem.type,
        description: editingItem.description || "",
        rules: editingItem.rules || "",
        tags: editingItem.tags ? editingItem.tags.join(", ") : "",
        is_hidden: editingItem.is_hidden || false,
        base_hp: ancestryItem.base_hp || 0,
        base_ac: ancestryItem.base_ac || 0,
        base_trait: ancestryItem.base_trait || "",
      });
    }
  }, [editingItem]);

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name.trim()) {
      alert(t("content.messages.pleaseEnterName"));
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray: string[] = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const contentData = {
        name: formData.name,
        type: formData.type,
        description: formData.description || null,
        rules: formData.rules || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        is_hidden: formData.is_hidden,
        ...(formData.type === "ancestry" && {
          base_hp: formData.base_hp || 0,
          base_ac: formData.base_ac || 0,
          base_trait: formData.base_trait || "",
        }),
      };

      if (editingItem && onEdit) {
        // Update existing content
        const result = await updateContent(editingItem.id, contentData);
        if (result) {
          onEdit(result);
          onClose();
        } else {
          alert(t("content.messages.failedToUpdateContent"));
        }
      } else {
        // Add new content
        const result = await addContent(contentData);
        if (result) {
          onAdd(result);
          setFormData({
            name: "",
            type: "trait",
            description: "",
            rules: "",
            tags: "",
            is_hidden: false,
          });
          onClose();
        } else {
          alert(t("content.messages.failedToAddContent"));
        }
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(
        editingItem
          ? t("content.messages.failedToUpdateContent")
          : t("content.messages.failedToAddContent")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof ContentFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ): void => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setFormData({ ...formData, [field]: value });
    };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isEditing = !!editingItem;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing
              ? t("content.form.editContent")
              : t("content.form.addNewContent")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("content.form.name")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder={t("content.form.placeholders.enterContentName")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("content.form.type")}
            </label>
            <select
              value={formData.type}
              onChange={handleInputChange("type")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              disabled={isSubmitting}
            >
              {getContentTypesForUser(isAdmin).map((type: ContentType) => (
                <option key={type} value={type} className="capitalize">
                  {t(`content.types.${type}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("content.form.description")}
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange("description")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y"
              placeholder={t("content.form.placeholders.enterDescription")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("content.form.rules")}
            </label>
            <textarea
              value={formData.rules}
              onChange={handleInputChange("rules")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y"
              placeholder={t("content.form.placeholders.enterRules")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("content.form.tags")}
            </label>
            <TagAutocomplete
              value={formData.tags}
              onChange={(value) => setFormData({ ...formData, tags: value })}
              placeholder={t("content.form.placeholders.enterTags")}
              disabled={isSubmitting}
            />
          </div>

          {/* Ancestry-specific fields */}
          {formData.type === "ancestry" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {t("content.form.baseHp")}
                  </label>
                  <input
                    type="number"
                    value={formData.base_hp || 0}
                    onChange={handleInputChange("base_hp")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    {t("content.form.baseAc")}
                  </label>
                  <input
                    type="number"
                    value={formData.base_ac || 0}
                    onChange={handleInputChange("base_ac")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {t("content.form.baseTrait")}
                </label>
                <input
                  type="text"
                  value={formData.base_trait || ""}
                  onChange={handleInputChange("base_trait")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder={t("content.form.placeholders.enterBaseTrait")}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_hidden"
                checked={formData.is_hidden}
                onChange={handleInputChange("is_hidden")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <label
                htmlFor="is_hidden"
                className="text-sm font-medium text-gray-700"
              >
                {t("content.form.labels.hideFromPlayers")}
              </label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditing
                  ? t("content.form.labels.updating")
                  : t("content.form.labels.adding")
                : isEditing
                ? t("content.form.labels.updateContent")
                : t("content.form.labels.addContent")}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-300 text-gray-700 rounded-md py-2 hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function D6RPGSite() {
  const { t, language } = useI18n();
  const [content, setContent] = useState<D6Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<D6Content[]>([]);
  const [selectedType, setSelectedType] = useState<ContentType | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminState, setAdminState] = useState<AdminState>({
    isLoggedIn: false,
    password: "",
  });
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showHiddenContent, setShowHiddenContent] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<D6Content | null>(null);

  // Simple admin password (you can change this)
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    loadContent();
    // Check if admin is already logged in
    const savedPassword = localStorage.getItem("admin_password");
    if (savedPassword === ADMIN_PASSWORD) {
      setAdminState({ isLoggedIn: true, password: savedPassword });
    }
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const data = await fetchContent();
      if (data.length > 0) {
        setContent(data);
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = content;

    // Filter by visibility
    if (!adminState.isLoggedIn) {
      filtered = filtered.filter((item) => !item.is_hidden);
    } else if (!showHiddenContent) {
      filtered = filtered.filter((item) => !item.is_hidden);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(
        (item: D6Content) => item.type === selectedType
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item: D6Content) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some((tag: string) => {
            const translatedTag = getTagTranslation(tag, language);
            return (
              tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
              translatedTag.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
      );
    }

    setFilteredContent(filtered);
  }, [
    content,
    selectedType,
    searchTerm,
    adminState.isLoggedIn,
    showHiddenContent,
    language,
  ]);

  const handleAddContent = (newContent: D6Content): void => {
    setContent([newContent, ...content]);
  };

  const handleDeleteContent = async (
    id: string,
    type: ContentType
  ): Promise<void> => {
    const success = await deleteContent(id, type);
    if (!success) {
      alert(t("content.messages.failedToDeleteContent"));
      return;
    }

    setContent(content.filter((item) => item.id !== id));
  };

  const handleEditContent = (item: D6Content) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleUpdateContent = (updatedItem: D6Content) => {
    setContent(
      content.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
    setShowForm(false);
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setAdminState({ isLoggedIn: true, password });
      localStorage.setItem("admin_password", password);
      setShowAdminLogin(false);
    } else {
      alert(t("admin.incorrectPassword"));
    }
  };

  const handleAdminLogout = () => {
    setAdminState({ isLoggedIn: false, password: "" });
    localStorage.removeItem("admin_password");
    setShowHiddenContent(false);
  };

  const exportToMarkdown = () => {
    const markdownContent = content
      .filter((item) => !item.is_hidden || adminState.isLoggedIn)
      .map((item) => contentToMarkdown(item))
      .join("\n\n---\n\n");

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "d6-content.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeCount = (type: ContentType): number => {
    const items = content.filter((item: D6Content) => item.type === type);

    return items.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Navbar
        isAdmin={adminState.isLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        onShowAdminLogin={() => setShowAdminLogin(true)}
        showAdminLogin={showAdminLogin}
        onCloseAdminLogin={() => setShowAdminLogin(false)}
        showHiddenContent={showHiddenContent}
        onToggleHiddenContent={() => setShowHiddenContent(!showHiddenContent)}
        onExportToMarkdown={exportToMarkdown}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("content.form.placeholders.searchContent")}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            {adminState.isLoggedIn && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t("content.form.addNewContent")}
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t("stats.all")} ({filteredContent.length})
            </button>
            {getContentTypesForUser(adminState.isLoggedIn).map(
              (type: ContentType) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    selectedType === type
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t(`content.types.${type}`)}s ({typeCount(type)})
                </button>
              )
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {getContentTypesForUser(adminState.isLoggedIn).map(
            (type: ContentType) => (
              <div
                key={type}
                className="bg-white rounded-lg p-4 text-center shadow-sm"
              >
                <div className="text-2xl font-bold text-gray-800">
                  {typeCount(type)}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {t(`content.types.${type}`)}s
                </div>
              </div>
            )
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item: D6Content) => (
            <ContentCard
              key={item.id}
              item={item}
              onDelete={(id, type) => handleDeleteContent(id, type)}
              onEdit={handleEditContent}
              isAdmin={adminState.isLoggedIn}
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t("content.messages.noContentFound")}
            </p>
          </div>
        )}

        {/* Add/Edit Content Form */}
        {showForm && (
          <ContentForm
            onAdd={handleAddContent}
            onEdit={handleUpdateContent}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            isAdmin={adminState.isLoggedIn}
            editingItem={editingItem}
          />
        )}

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onCancel={() => setShowAdminLogin(false)}
          />
        )}
      </div>
    </div>
  );
}
