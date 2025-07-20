import { Edit, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n/context";
import { getTagTranslation } from "../i18n/tags";
import { ContentType, D6Content } from "../types/content";

interface ContentCardProps {
  item: D6Content;
  onDelete?: (id: string, type: ContentType) => void;
  onEdit?: (item: D6Content) => void;
  isAdmin: boolean;
}

export default function ContentCard({
  item,
  onDelete,
  onEdit,
  isAdmin,
}: ContentCardProps) {
  const { t, language } = useI18n();
  const typeColors: Record<ContentType, string> = {
    trait: "bg-blue-50 border-blue-200 text-blue-800",
    object: "bg-green-50 border-green-200 text-green-800",
    class: "bg-purple-50 border-purple-200 text-purple-800",
    ancestry: "bg-orange-50 border-orange-200 text-orange-800",
    trap: "bg-red-50 border-red-200 text-red-800",
    monster: "bg-gray-50 border-gray-200 text-gray-800",
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
            {t(`content.types.${item.type}`)}
          </span>
          {isAdmin && (
            <>
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

      {item.rules && (
        <div className="mb-3">
          <h4 className="font-semibold text-sm mb-1">
            {t("content.form.rules")}:
          </h4>
          <p className="text-sm bg-white bg-opacity-30 p-2 rounded">
            {item.rules}
          </p>
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-white bg-opacity-40 rounded"
            >
              {getTagTranslation(tag, language)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
