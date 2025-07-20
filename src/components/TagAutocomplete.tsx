"use client";

import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/context";
import { TAG_KEYS, getTagTranslation } from "../i18n/tags";

interface TagAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagAutocomplete({
  value,
  onChange,
  placeholder,
  disabled = false,
}: TagAutocompleteProps) {
  const { language } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated tags from value
  useEffect(() => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setSelectedTags(tags);
  }, [value]);

  // Filter tags based on search term
  const filteredTags = TAG_KEYS.filter((tagKey) => {
    const translation = getTagTranslation(tagKey, language);
    const isSelected = selectedTags.includes(tagKey);
    const matchesSearch = translation
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return !isSelected && matchesSearch;
  }).slice(0, 10); // Limit to 10 suggestions

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);

    // Update the main value with current tags + input
    const currentTags = selectedTags.join(", ");
    const newValue = currentTags ? `${currentTags}, ${inputValue}` : inputValue;
    onChange(newValue);
  };

  const handleTagSelect = (tagKey: string) => {
    const newSelectedTags = [...selectedTags, tagKey];
    setSelectedTags(newSelectedTags);
    setSearchTerm("");
    setIsOpen(false);
    onChange(newSelectedTags.join(", "));
    inputRef.current?.focus();
  };

  const handleTagRemove = (tagKey: string) => {
    const newSelectedTags = selectedTags.filter((tag) => tag !== tagKey);
    setSelectedTags(newSelectedTags);
    onChange(newSelectedTags.join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredTags.length > 0) {
      e.preventDefault();
      handleTagSelect(filteredTags[0]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedTags.map((tagKey) => (
            <span
              key={tagKey}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {getTagTranslation(tagKey, language)}
              <button
                type="button"
                onClick={() => handleTagRemove(tagKey)}
                className="text-blue-600 hover:text-blue-800"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          disabled={disabled}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && filteredTags.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredTags.map((tagKey) => (
            <button
              key={tagKey}
              type="button"
              onClick={() => handleTagSelect(tagKey)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {getTagTranslation(tagKey, language)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
