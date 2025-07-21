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

  // Lazy loading state
  const [displayedTags, setDisplayedTags] = useState<TagDefinition[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 12;

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
    let filtered = tagDefinitions;
    
    if (searchTerm.trim()) {
      filtered = tagDefinitions.filter((tag) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          tag.code.toLowerCase().includes(searchLower) ||
          tag.name_en.toLowerCase().includes(searchLower) ||
          tag.name_fr.toLowerCase().includes(searchLower) ||
          (tag.category && tag.category.toLowerCase().includes(searchLower))
        );
      });
    }
    
    setFilteredTags(filtered);
    
    // Reset lazy loading when search changes
    setCurrentPage(1);
    setDisplayedTags(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [searchTerm, tagDefinitions]);

  // Load more tags
  const loadMoreTags = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredTags.slice(startIndex, endIndex);

    setDisplayedTags(prev => {
      // Prevent duplicates by checking if items already exist
      const existingIds = new Set(prev.map(tag => tag.id));
      const uniqueNewItems = newItems.filter(tag => !existingIds.has(tag.id));
      return [...prev, ...uniqueNewItems];
    });
    setCurrentPage(nextPage);
    setHasMore(endIndex < filteredTags.length);
    setIsLoadingMore(false);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreTags();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('tags-scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, isLoadingMore, filteredTags]);

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
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("tags.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t("tags.addNewTag")}
              </button>
            </div>
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
            {displayedTags.map((tag) => (
              <TagDefinitionCard
                key={tag.id}
                tag={tag}
                onDelete={isAdmin ? handleDeleteTag : undefined}
                onEdit={isAdmin ? handleEditClick : undefined}
                isAdmin={isAdmin}
              />
            ))}
            {isLoadingMore && (
              <div className="col-span-full text-center py-4">
                <div className="text-gray-500">{t("common.loadingMore")}</div>
              </div>
            )}
            {!hasMore && displayedTags.length > 0 && (
              <div className="col-span-full text-center py-4">
                <div className="text-gray-500">{t("tags.noMoreTags")}</div>
              </div>
            )}
            <div id="tags-scroll-sentinel" className="h-1"></div>
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
