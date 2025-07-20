"use client";

import {
  Dice6,
  Download,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import AdminLogin from "../components/AdminLogin";
import {
  AdminState,
  ContentFormData,
  ContentType,
  D6Content,
} from "../types/content";
import { contentToMarkdown, parseMarkdown } from "../utils/markdown";
import { addContent, deleteContent, fetchContent } from "../utils/supabase";

const CONTENT_TYPES: ContentType[] = ["trait", "object", "class", "ancestry"];
interface ContentCardProps {
  item: D6Content;
  onDelete?: (id: string) => void;
  isAdmin: boolean;
}

function ContentCard({ item, onDelete, isAdmin }: ContentCardProps) {
  const typeColors: Record<ContentType, string> = {
    trait: "bg-blue-50 border-blue-200 text-blue-800",
    object: "bg-green-50 border-green-200 text-green-800",
    class: "bg-purple-50 border-purple-200 text-purple-800",
    ancestry: "bg-orange-50 border-orange-200 text-orange-800",
  };

  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (onDelete) {
      if (showDeleteConfirm) {
        onDelete(item.id);
        setShowDeleteConfirm(false);
      } else {
        setShowDeleteConfirm(true);
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => setShowDeleteConfirm(false), 3000);
      }
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        typeColors[item.type]
      } transition-all hover:shadow-md hover:scale-105 relative ${
        item.is_hidden ? "opacity-60" : ""
      }`}
    >
      {item.is_hidden && (
        <div className="absolute top-2 left-2">
          <EyeOff className="w-4 h-4 text-gray-500" />
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 capitalize">
            {item.type}
          </span>
          {isAdmin && onDelete && (
            <button
              onClick={handleDeleteClick}
              className={`p-1 rounded transition-colors ${
                showDeleteConfirm
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "text-red-500 hover:text-red-700 hover:bg-red-50"
              } cursor-pointer`}
              title={
                showDeleteConfirm ? "Click again to confirm deletion" : "Delete"
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm mb-3 opacity-80">{item.description}</p>

      {item.rules && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-1">Rules:</h4>
          <p className="text-sm bg-white bg-opacity-30 p-2 rounded">
            {item.rules}
          </p>
        </div>
      )}

      {item.markdown_content && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm">Markdown Content:</h4>
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-70 cursor-pointer"
            >
              {showMarkdown ? "Hide" : "Show"}
            </button>
          </div>
          {showMarkdown && (
            <div
              className="text-sm bg-white bg-opacity-30 p-2 rounded prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(item.markdown_content),
              }}
            />
          )}
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-white bg-opacity-40 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface ContentFormProps {
  onAdd: (content: D6Content) => void;
  onClose: () => void;
  isAdmin: boolean;
}

function ContentForm({ onAdd, onClose, isAdmin }: ContentFormProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    name: "",
    type: "trait",
    description: "",
    rules: "",
    tags: "",
    is_hidden: false,
    markdown_content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray: string[] = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const newContent = {
        name: formData.name,
        type: formData.type,
        description: formData.description || null,
        rules: formData.rules || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        is_hidden: formData.is_hidden,
        markdown_content: formData.markdown_content || null,
      };

      const result = await addContent(newContent);

      if (result) {
        onAdd(result);
        setFormData({
          name: "",
          type: "trait",
          description: "",
          rules: "",
          tags: "",
          is_hidden: false,
          markdown_content: "",
        });
        onClose();
      } else {
        alert("Failed to add content. Please try again.");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content. Please try again.");
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

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Content</h2>
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
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter content name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Type
            </label>
            <select
              value={formData.type}
              onChange={handleInputChange("type")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              disabled={isSubmitting}
            >
              {CONTENT_TYPES.map((type: ContentType) => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange("description")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
              placeholder="Brief description"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Rules
            </label>
            <textarea
              value={formData.rules}
              onChange={handleInputChange("rules")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
              placeholder="Game mechanics and rules"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={handleInputChange("tags")}
              placeholder="magic, combat, weapon"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              disabled={isSubmitting}
            />
          </div>

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
                Hide from players
              </label>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Markdown Content (optional)
            </label>
            <textarea
              value={formData.markdown_content}
              onChange={handleInputChange("markdown_content")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
              placeholder="# Title&#10;&#10;## Description&#10;Your content here..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Content"}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-300 text-gray-700 rounded-md py-2 hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function D6RPGSite() {
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
          item.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredContent(filtered);
  }, [
    content,
    selectedType,
    searchTerm,
    adminState.isLoggedIn,
    showHiddenContent,
  ]);

  const handleAddContent = (newContent: D6Content): void => {
    setContent([newContent, ...content]);
  };

  const handleDeleteContent = async (id: string): Promise<void> => {
    const success = await deleteContent(id);
    if (!success) {
      alert("Failed to delete content. Please try again.");
      return;
    }

    setContent(content.filter((item) => item.id !== id));
  };

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setAdminState({ isLoggedIn: true, password });
      localStorage.setItem("admin_password", password);
      setShowAdminLogin(false);
    } else {
      alert("Incorrect password");
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

  const typeCount = (type: ContentType): number =>
    content.filter((item: D6Content) => item.type === type).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dice6 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Tiny D6 RPG Content
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse and manage traits, objects, classes, and ancestries for your
            Tiny D6 RPG campaign. Share this page with your players for easy
            reference during sessions.
          </p>
        </div>

        {/* Admin Controls */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {adminState.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 font-medium">
                Admin Mode
              </span>
              <button
                onClick={() => setShowHiddenContent(!showHiddenContent)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                {showHiddenContent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showHiddenContent ? "Hide" : "Show"} Hidden
              </button>
              <button
                onClick={exportToMarkdown}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Download className="w-4 h-4" />
                Export MD
              </button>
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              <Lock className="w-4 h-4" />
              Admin Login
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content by name, description, or tags..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Content
            </button>
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
              All ({filteredContent.length})
            </button>
            {CONTENT_TYPES.map((type: ContentType) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  selectedType === type
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type}s ({typeCount(type)})
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CONTENT_TYPES.map((type: ContentType) => (
            <div
              key={type}
              className="bg-white rounded-lg p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-gray-800">
                {typeCount(type)}
              </div>
              <div className="text-sm text-gray-600 capitalize">{type}s</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item: D6Content) => (
            <ContentCard
              key={item.id}
              item={item}
              onDelete={handleDeleteContent}
              isAdmin={adminState.isLoggedIn}
            />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No content found matching your criteria.
            </p>
          </div>
        )}

        {/* Add Content Form */}
        {showForm && (
          <ContentForm
            onAdd={handleAddContent}
            onClose={() => setShowForm(false)}
            isAdmin={adminState.isLoggedIn}
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
