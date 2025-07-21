import {
  Copy,
  Edit,
  Gem,
  Star,
  Swords,
  Trash2,
  User,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n/context";
import {
  Ancestry,
  ContentType,
  D6Content,
  Object as ObjectType,
  Spell,
  TagDefinition,
  Trait,
} from "../types/content";
import { getTagTranslationSync } from "../utils/tagTranslation";
import { getSpellLevelTranslation } from "../utils/translation";

interface ContentCardProps {
  item: D6Content;
  onDelete?: (id: string, type: ContentType) => void;
  onEdit?: (item: D6Content) => void;
  onDuplicate?: (item: D6Content) => void;
  isAdmin: boolean;
  tagDefinitions?: TagDefinition[];
}

export default function ContentCard({
  item,
  onDelete,
  onEdit,
  onDuplicate,
  isAdmin,
  tagDefinitions = [],
}: ContentCardProps) {
  const { t, language } = useI18n();
  const typeColors: Record<ContentType, string> = {
    trait: "bg-blue-50 border-blue-200 text-blue-800",
    object: "bg-green-50 border-green-200 text-green-800",
    class: "bg-red-50 border-red-200 text-red-800",
    ancestry: "bg-orange-50 border-orange-200 text-orange-800",
    spell: "bg-purple-50 border-purple-200 text-purple-800",
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case "trait":
        return <Star className="w-5 h-5 text-blue-600" fill="currentColor" />;
      case "object":
        return <Gem className="w-5 h-5 text-green-600" fill="currentColor" />;
      case "class":
        return <Swords className="w-5 h-5 text-red-600" fill="currentColor" />;
      case "ancestry":
        return <User className="w-5 h-5 text-orange-600" fill="currentColor" />;
      case "spell":
        return (
          <Wand2 className="w-5 h-5 text-purple-600" fill="currentColor" />
        );
      default:
        return null;
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      if (showDeleteConfirm) {
        onDelete(item.id, item.type);
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
      onEdit(item);
    }
  };

  const handleDuplicateClick = () => {
    if (onDuplicate) {
      onDuplicate(item);
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        typeColors[item.type]
      } transition-all hover:shadow-md hover:scale-105 relative ${
        item.type === "ancestry" ? "flex flex-col" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div>{getTypeIcon(item.type)}</div>
          <h3 className="font-bold text-lg">{item.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 capitalize">
            {t(`content.types.${item.type}`)}
          </span>
          {isAdmin && (
            <>
              {onDuplicate && (
                <button
                  onClick={handleDuplicateClick}
                  className="p-1 rounded transition-colors text-green-500 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                  title={t("content.actions.duplicate")}
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={handleEditClick}
                  className="p-1 rounded transition-colors text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                  title={t("content.actions.edit")}
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className={`p-1 rounded transition-colors ${
                    showDeleteConfirm
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "text-red-500 hover:text-red-700 hover:bg-red-50"
                  } cursor-pointer`}
                  title={
                    showDeleteConfirm
                      ? t("content.messages.clickToConfirmDeletion")
                      : t("common.delete")
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-sm mb-3 opacity-80">{item.description}</p>

      {/* Requirement field - only for traits */}
      {item.type === "trait" && (item as Trait).requirement && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-1 text-red-600">
            {t("content.form.requirement")}:
          </h4>
          <p className="text-sm bg-red-100 border border-red-500 p-2 rounded text-red-600">
            {(item as Trait).requirement}
          </p>
        </div>
      )}

      {item.type === "object" && (item as ObjectType).rules && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-1">
            {t("content.form.rules")}:
          </h4>
          <p className="text-sm bg-white bg-opacity-30 p-2 rounded">
            {(item as ObjectType).rules}
          </p>
        </div>
      )}

      {/* Spell-specific properties */}
      {item.type === "spell" && (
        <div className="mb-3">
          {(item as Spell).rules && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-1">
                {t("content.form.rules")}:
              </h4>
              <p className="text-sm bg-white bg-opacity-30 p-2 rounded">
                {(item as Spell).rules}
              </p>
            </div>
          )}
          <div className="mb-3">
            <h4 className="font-semibold text-sm mb-1 text-purple-700">
              {t("content.form.spellLevel")}:
            </h4>
            <span className="text-sm bg-purple-100 border border-purple-300 px-2 py-1 rounded capitalize">
              {getSpellLevelTranslation((item as Spell).spell_level, language)}
            </span>
          </div>
        </div>
      )}

      {/* Ancestry-specific properties */}
      {item.type === "ancestry" && (
        <div className="mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div className="bg-white bg-opacity-30 p-2 rounded text-center">
              <div className="font-semibold text-blue-700">
                {(item as Ancestry).base_hp || 0}
              </div>
              <div className="text-xs text-gray-600">
                {t("content.form.baseHp")}
              </div>
            </div>
            <div className="bg-white bg-opacity-30 p-2 rounded text-center">
              <div className="font-semibold text-green-700">
                {(item as Ancestry).base_ac || 0}
              </div>
              <div className="text-xs text-gray-600">
                {t("content.form.baseAc")}
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-30 p-2 rounded text-center">
            <div className="font-semibold text-purple-700">
              {(item as Ancestry).base_trait || "-"}
            </div>
            <div className="text-xs text-gray-600">
              {t("content.form.baseTrait")}
            </div>
          </div>
        </div>
      )}

      {/* Tags - moved to bottom for ancestry, otherwise in normal position */}
      {item.tags && item.tags.length > 0 && (
        <div
          className={`flex flex-wrap gap-1 ${
            item.type === "ancestry" ? "mt-auto" : ""
          }`}
        >
          {item.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-white bg-opacity-40 rounded"
            >
              {getTagTranslationSync(tag, language, tagDefinitions)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
