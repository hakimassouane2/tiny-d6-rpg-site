"use client";

import { Plus, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import AdminLogin from "../components/AdminLogin";
import ContentCard from "../components/ContentCard";
import Navbar from "../components/Navbar";
import TagAutocomplete from "../components/TagAutocomplete";
import { useI18n } from "../i18n/context";
import {
  AdminState,
  Ancestry,
  ContentFormData,
  ContentType,
  D6Content,
  Object as ObjectType,
  Spell,
  TagDefinition,
  Trait,
} from "../types/content";
import { containsIgnoreDiacritics } from "../utils/diacriticUtils";
import { contentToMarkdown } from "../utils/markdown";
import {
  addContent,
  deleteContent,
  fetchContent,
  fetchTagDefinitions,
  updateContent,
} from "../utils/supabase";
import { getTagTranslationSync } from "../utils/tagTranslation";

const CONTENT_TYPES: ContentType[] = [
  "trait",
  "object",
  "class",
  "ancestry",
  "spell",
];

// Get content types based on admin status
const getContentTypesForUser = (isAdmin: boolean): ContentType[] => {
  if (isAdmin) {
    return CONTENT_TYPES;
  }
  return ["trait", "object", "class", "ancestry", "spell"];
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
    requirement: "",
    spell_level: "minor",
    base_hp: 0,
    base_ac: 3,
    base_trait: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingItem) {
      const ancestryItem = editingItem as Ancestry;
      const objectItem = editingItem as ObjectType;
      const traitItem = editingItem as Trait;

      setFormData({
        name: editingItem.name,
        type: editingItem.type,
        description: editingItem.description || "",
        rules: editingItem.type === "object" ? objectItem.rules || "" : "",
        tags: editingItem.tags ? editingItem.tags.join(", ") : "",
        requirement:
          editingItem.type === "trait" ? traitItem.requirement || "" : "",
        spell_level:
          editingItem.type === "spell"
            ? (editingItem as Spell).spell_level || "minor"
            : "minor",
        base_hp:
          editingItem.type === "ancestry" ? ancestryItem.base_hp || 0 : 0,
        base_ac:
          editingItem.type === "ancestry" ? ancestryItem.base_ac || 0 : 0,
        base_trait:
          editingItem.type === "ancestry" ? ancestryItem.base_trait || "" : "",
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
        tags: tagsArray.length > 0 ? tagsArray : null,
        ...(formData.type === "object" && {
          rules: formData.rules || null,
        }),
        ...(formData.type === "trait" && {
          requirement: formData.requirement || null,
        }),
        ...(formData.type === "spell" && {
          spell_level: formData.spell_level || "minor",
          rules: formData.rules || null,
        }),
        ...(formData.type === "ancestry" && {
          base_hp: formData.base_hp || 0,
          base_ac: formData.base_ac || 0,
          base_trait: formData.base_trait || "",
        }),
      };

      if (editingItem && editingItem.id && onEdit) {
        // Update existing content
        const result = await updateContent(editingItem.id, contentData);
        if (result) {
          onEdit(result);
          onClose();
        } else {
          alert(t("content.messages.failedToUpdateContent"));
        }
      } else {
        // Add new content (including duplicates)
        const result = await addContent(contentData);
        if (result) {
          onAdd(result);
          setFormData({
            name: "",
            type: "trait",
            description: "",
            rules: "",
            tags: "",
            requirement: "",
            spell_level: "minor",
            base_hp: 0,
            base_ac: 3,
            base_trait: "",
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
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y"
              placeholder={t("content.form.placeholders.enterDescription")}
              disabled={isSubmitting}
            />
          </div>

          {/* Rules field - only for objects */}
          {formData.type === "object" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("content.form.rules")}
              </label>
              <textarea
                value={formData.rules}
                onChange={handleInputChange("rules")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-y"
                placeholder={t("content.form.placeholders.enterRules")}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Spell Level field - only for spells */}
          {formData.type === "spell" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("content.form.spellLevel")}
              </label>
              <select
                value={formData.spell_level}
                onChange={handleInputChange("spell_level")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                disabled={isSubmitting}
              >
                <option value="minor">{t("content.form.minorSpell")}</option>
                <option value="major">{t("content.form.majorSpell")}</option>
              </select>
            </div>
          )}

          {/* Rules field - only for spells */}
          {formData.type === "spell" && (
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
          )}

          {/* Requirement field - only for traits */}
          {formData.type === "trait" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("content.form.requirement")}
              </label>
              <input
                type="text"
                value={formData.requirement}
                onChange={handleInputChange("requirement")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder={t("content.form.placeholders.enterRequirement")}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("content.form.requirementHelp")}
              </p>
            </div>
          )}

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
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([]);
  const [adminState, setAdminState] = useState<AdminState>({
    isLoggedIn: false,
    isAdmin: false,
    password: "",
  });
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<D6Content | null>(null);

  // Lazy loading state
  const [displayedContent, setDisplayedContent] = useState<D6Content[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 12;

  // Simple admin password (you can change this)
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    loadContent();
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

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const [contentData, tagData] = await Promise.all([
        fetchContent(),
        fetchTagDefinitions(),
      ]);

      setContent(contentData);
      setTagDefinitions(tagData);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = content;

    if (selectedType !== "all") {
      filtered = filtered.filter(
        (item: D6Content) => item.type === selectedType
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item: D6Content) =>
          containsIgnoreDiacritics(item.name, searchTerm) ||
          (item.description &&
            containsIgnoreDiacritics(item.description, searchTerm)) ||
          item.tags?.some((tag: string) => {
            const translatedTag = getTagTranslationSync(
              tag,
              language,
              tagDefinitions
            );
            return (
              containsIgnoreDiacritics(tag, searchTerm) ||
              containsIgnoreDiacritics(translatedTag, searchTerm)
            );
          })
      );
    }

    setFilteredContent(filtered);

    // Reset lazy loading when filters change
    setCurrentPage(1);
    setDisplayedContent(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [content, selectedType, searchTerm, language, tagDefinitions]);

  const loadMoreContent = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredContent.slice(startIndex, endIndex);

    setDisplayedContent((prev) => {
      // Prevent duplicates by checking if items already exist
      const existingIds = new Set(prev.map((item) => item.id));
      const uniqueNewItems = newItems.filter(
        (item) => !existingIds.has(item.id)
      );
      return [...prev, ...uniqueNewItems];
    });
    setCurrentPage(nextPage);
    setHasMore(endIndex < filteredContent.length);
    setIsLoadingMore(false);
  }, [currentPage, filteredContent, hasMore, isLoadingMore, ITEMS_PER_PAGE]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreContent();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreContent]);

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

  const handleDuplicateContent = (item: D6Content) => {
    // Create a duplicate item without id to trigger form pre-filling
    const { id, ...itemWithoutId } = item;
    const duplicateItem = {
      ...itemWithoutId,
      name: `${item.name} (Copy)`,
    } as D6Content;
    setEditingItem(duplicateItem);
    setShowForm(true);
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setAdminState({ isLoggedIn: true, isAdmin: true, password });
      localStorage.setItem("admin_password", password);
      setShowAdminLogin(false);
    } else {
      alert(t("admin.incorrectPassword"));
    }
  };

  const handleAdminLogout = () => {
    setAdminState({ isLoggedIn: false, isAdmin: false, password: "" });
    localStorage.removeItem("admin_password");
  };

  const exportToMarkdown = () => {
    const markdownContent = content
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
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
          {displayedContent.map((item: D6Content) => (
            <ContentCard
              key={item.id}
              item={item}
              onDelete={(id, type) => handleDeleteContent(id, type)}
              onEdit={handleEditContent}
              onDuplicate={handleDuplicateContent}
              isAdmin={adminState.isLoggedIn}
              tagDefinitions={tagDefinitions}
            />
          ))}
          {isLoadingMore && (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t("common.loadingMore")}</p>
            </div>
          )}
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
      <div id="scroll-sentinel" className="h-4 bg-transparent"></div>
    </div>
  );
}
