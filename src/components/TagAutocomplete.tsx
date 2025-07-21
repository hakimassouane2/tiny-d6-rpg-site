"use client";

import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/context";
import { TagDefinition } from "../types/content";
import {
  containsIgnoreDiacritics,
  startsWithIgnoreDiacritics,
} from "../utils/diacriticUtils";
import { fetchTagDefinitions } from "../utils/supabase";

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
  const [isDropdownClick, setIsDropdownClick] = useState(false);
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tag definitions on component mount
  useEffect(() => {
    loadTagDefinitions();
  }, []);

  const loadTagDefinitions = async () => {
    try {
      const tags = await fetchTagDefinitions();
      setTagDefinitions(tags);
    } catch (error) {
      console.error("Error loading tag definitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse comma-separated tags from value
  useEffect(() => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Convert any translated tags back to their codes
    const normalizedTags = tags.map((tag) => {
      // If it's already a code, keep it
      if (tagDefinitions.some((td) => td.code === tag)) {
        return tag;
      }
      // If it's a translation, find the code
      const tagDef = tagDefinitions.find(
        (td) =>
          containsIgnoreDiacritics(td.name_en, tag) ||
          containsIgnoreDiacritics(td.name_fr, tag)
      );
      return tagDef ? tagDef.code : tag; // Fallback to original if not found
    });

    setSelectedTags(normalizedTags);
  }, [value, tagDefinitions]);

  // Filter tags based on search term
  const filteredTags = tagDefinitions
    .filter((tagDef) => {
      const translation = language === "fr" ? tagDef.name_fr : tagDef.name_en;
      const isSelected = selectedTags.includes(tagDef.code);
      const matchesSearch =
        containsIgnoreDiacritics(translation, searchTerm) ||
        containsIgnoreDiacritics(tagDef.code, searchTerm);
      return !isSelected && matchesSearch;
    })
    .slice(0, 10);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);

    // Check if input contains commas (multiple tags)
    if (inputValue.includes(",")) {
      const newTags = inputValue
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !selectedTags.includes(tag));

      if (newTags.length > 0) {
        const newSelectedTags = [...selectedTags, ...newTags];
        setSelectedTags(newSelectedTags);
        setSearchTerm("");
        setIsOpen(false);
        onChange(newSelectedTags.join(", "));
      }
    }
  };

  const handleTagSelect = (tagDef: TagDefinition) => {
    setIsDropdownClick(true);
    const newSelectedTags = [...selectedTags, tagDef.code];
    setSelectedTags(newSelectedTags);
    setSearchTerm("");
    setIsOpen(false);
    onChange(newSelectedTags.join(", "));

    // Focus back to input after selection
    setTimeout(() => {
      inputRef.current?.focus();
      // Reset the flag after focusing
      setTimeout(() => setIsDropdownClick(false), 50);
    }, 10);
  };

  const handleTagRemove = (tagCode: string) => {
    const newSelectedTags = selectedTags.filter((tag) => tag !== tagCode);
    setSelectedTags(newSelectedTags);
    onChange(newSelectedTags.join(", "));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTags.length > 0) {
        // Select first suggestion
        handleTagSelect(filteredTags[0]);
      } else if (searchTerm.trim()) {
        // Add custom tag if no suggestions
        const customTag = searchTerm.trim();
        if (!selectedTags.includes(customTag)) {
          const newSelectedTags = [...selectedTags, customTag];
          setSelectedTags(newSelectedTags);
          setSearchTerm("");
          setIsOpen(false);
          onChange(newSelectedTags.join(", "));
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    // Don't process blur if a dropdown item was just clicked
    if (isDropdownClick) {
      return;
    }

    setTimeout(() => {
      // Only add the search term if it's not empty and not already selected
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch && !selectedTags.includes(trimmedSearch)) {
        // Check if this is a partial match that should be ignored
        const isPartialMatch = tagDefinitions.some((tagDef) => {
          const translation =
            language === "fr" ? tagDef.name_fr : tagDef.name_en;
          return (
            startsWithIgnoreDiacritics(translation, trimmedSearch) &&
            translation.toLowerCase() !== trimmedSearch.toLowerCase()
          );
        });

        if (!isPartialMatch) {
          const newSelectedTags = [...selectedTags, trimmedSearch];
          setSelectedTags(newSelectedTags);
          setSearchTerm("");
          onChange(newSelectedTags.join(", "));
        }
      }
      setIsOpen(false);
    }, 200);
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

  const getTagDisplayName = (tagCode: string) => {
    const tagDef = tagDefinitions.find((td) => td.code === tagCode);
    if (tagDef) {
      return language === "fr" ? tagDef.name_fr : tagDef.name_en;
    }
    return tagCode;
  };

  if (isLoading) {
    return (
      <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500">
        Loading tags...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedTags.map((tagCode) => (
            <span
              key={tagCode}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {getTagDisplayName(tagCode)}
              <button
                type="button"
                onClick={() => handleTagRemove(tagCode)}
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
          onBlur={handleBlur}
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
          {filteredTags.map((tagDef) => (
            <button
              key={tagDef.code}
              type="button"
              onClick={() => handleTagSelect(tagDef)}
              className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="flex justify-between items-center">
                <span>
                  {language === "fr" ? tagDef.name_fr : tagDef.name_en}
                </span>
                {tagDef.category && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tagDef.category}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
