"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useI18n } from "../i18n/context";
import { TagDefinition, TagDefinitionFormData } from "../types/content";
import { addTagDefinition, updateTagDefinition } from "../utils/supabase";

interface TagDefinitionFormProps {
  onAdd: (tag: TagDefinition) => void;
  onEdit: (tag: TagDefinition) => void;
  onClose: () => void;
  editingTag?: TagDefinition | null;
}

export default function TagDefinitionForm({
  onAdd,
  onEdit,
  onClose,
  editingTag,
}: TagDefinitionFormProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<TagDefinitionFormData>({
    code: "",
    name_en: "",
    name_fr: "",
    category: "",
    is_hidden: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingTag) {
      setFormData({
        code: editingTag.code,
        name_en: editingTag.name_en,
        name_fr: editingTag.name_fr,
        category: editingTag.category || "",
        is_hidden: editingTag.is_hidden,
      });
    }
  }, [editingTag]);

  const handleInputChange =
    (field: keyof TagDefinitionFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.code.trim()) {
      alert(t("tags.form.placeholders.enterCode"));
      return;
    }

    if (!formData.name_en.trim()) {
      alert(t("tags.form.placeholders.enterNameEn"));
      return;
    }

    if (!formData.name_fr.trim()) {
      alert(t("tags.form.placeholders.enterNameFr"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingTag && onEdit) {
        // Update existing tag definition
        const result = await updateTagDefinition(editingTag.id, formData);
        if (result) {
          onEdit(result);
          onClose();
        } else {
          alert("Failed to update tag definition");
        }
      } else {
        // Add new tag definition
        const result = await addTagDefinition(formData);
        if (result) {
          onAdd(result);
          setFormData({
            code: "",
            name_en: "",
            name_fr: "",
            category: "",
            is_hidden: false,
          });
          onClose();
        } else {
          alert("Failed to add tag definition");
        }
      }
    } catch (error) {
      console.error("Error saving tag definition:", error);
      alert(
        editingTag
          ? "Failed to update tag definition"
          : "Failed to add tag definition"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingTag ? t("tags.editTag") : t("tags.addNewTag")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Code Field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("tags.form.code")}
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={handleInputChange("code")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder={t("tags.form.placeholders.enterCode")}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier for the tag (lowercase, no spaces)
            </p>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("tags.form.nameEn")}
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={handleInputChange("name_en")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder={t("tags.form.placeholders.enterNameEn")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("tags.form.nameFr")}
              </label>
              <input
                type="text"
                value={formData.name_fr}
                onChange={handleInputChange("name_fr")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder={t("tags.form.placeholders.enterNameFr")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("tags.form.category")} (Optional)
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={handleInputChange("category")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder={t("tags.form.placeholders.enterCategory")}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional category to group related tags
            </p>
          </div>

          {/* Hidden Checkbox */}
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
              {t("tags.form.hidden")}
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? editingTag
                  ? t("content.form.labels.updating")
                  : t("content.form.labels.adding")
                : editingTag
                ? t("content.actions.edit")
                : t("content.form.labels.addContent")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
