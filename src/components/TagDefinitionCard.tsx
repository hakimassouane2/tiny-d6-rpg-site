"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n/context";
import { TagDefinition } from "../types/content";

interface TagDefinitionCardProps {
  tag: TagDefinition;
  onDelete?: (id: string) => void;
  onEdit?: (tag: TagDefinition) => void;
  isAdmin: boolean;
}

export default function TagDefinitionCard({
  tag,
  onDelete,
  onEdit,
  isAdmin,
}: TagDefinitionCardProps) {
  const { language, t } = useI18n();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (onDelete) {
      if (showDeleteConfirm) {
        onDelete(tag.id);
        setShowDeleteConfirm(false);
      } else {
        setShowDeleteConfirm(true);
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => setShowDeleteConfirm(false), 3000);
      }
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(tag);
    }
  };

  // Get localized content based on current language
  const getName = () => {
    return language === "fr" ? tag.name_fr : tag.name_en;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              {t("tags.title")}
            </span>
            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
              {tag.code}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getName()}
          </h3>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              title={t("content.actions.edit")}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className={`p-2 rounded-md transition-colors ${
                showDeleteConfirm
                  ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
              }`}
              title={
                showDeleteConfirm
                  ? t("content.messages.clickToConfirmDeletion")
                  : t("common.delete")
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Language Toggle Preview */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm mb-1 text-gray-700">
          Preview (
          {language === "en" ? t("common.english") : t("common.french")}):
        </h4>
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            <strong>Name:</strong> {getName()}
          </div>
        </div>
      </div>

      {/* Category */}
      {tag.category && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-1 text-gray-700">
            {t("tags.form.category")}:
          </h4>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {tag.category}
          </span>
        </div>
      )}

      {/* Timestamps */}
      <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
        <div>
          Created: {new Date(tag.created_at || "").toLocaleDateString()}
        </div>
        {tag.updated_at && tag.updated_at !== tag.created_at && (
          <div>Updated: {new Date(tag.updated_at).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}
