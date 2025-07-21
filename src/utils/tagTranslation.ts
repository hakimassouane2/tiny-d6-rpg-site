import { Language } from "../i18n/config";
import { TAGS } from "../i18n/tags";
import { TagDefinition } from "../types/content";
import { getTagDefinitionByCode } from "./supabase";

// Cache for tag definitions to avoid repeated database calls
const tagDefinitionCache = new Map<string, TagDefinition>();

/**
 * Get tag translation with priority: Supabase tag definitions > hardcoded translations > tag code
 */
export async function getTagTranslation(
  tagCode: string,
  language: Language
): Promise<string> {
  // First, try to get from Supabase tag definitions
  let tagDefinition = tagDefinitionCache.get(tagCode);
  
  if (!tagDefinition) {
    const fetchedTagDefinition = await getTagDefinitionByCode(tagCode);
    if (fetchedTagDefinition) {
      tagDefinitionCache.set(tagCode, fetchedTagDefinition);
      tagDefinition = fetchedTagDefinition;
    }
  }

  if (tagDefinition) {
    return language === "fr" ? tagDefinition.name_fr : tagDefinition.name_en;
  }

  // Fallback to hardcoded translations
  const hardcodedTranslation = TAGS[tagCode]?.[language];
  if (hardcodedTranslation) {
    return hardcodedTranslation;
  }

  // Final fallback: return the tag code itself
  return tagCode;
}

/**
 * Get tag translation synchronously (for use in components that already have tag definitions)
 */
export function getTagTranslationSync(
  tagCode: string,
  language: Language,
  tagDefinitions: TagDefinition[]
): string {
  // First, try to get from provided tag definitions
  const tagDefinition = tagDefinitions.find(td => td.code === tagCode);
  
  if (tagDefinition) {
    return language === "fr" ? tagDefinition.name_fr : tagDefinition.name_en;
  }

  // Fallback to hardcoded translations
  const hardcodedTranslation = TAGS[tagCode]?.[language];
  if (hardcodedTranslation) {
    return hardcodedTranslation;
  }

  // Final fallback: return the tag code itself
  return tagCode;
}

/**
 * Clear the tag definition cache (useful when tag definitions are updated)
 */
export function clearTagDefinitionCache(): void {
  tagDefinitionCache.clear();
}

/**
 * Preload tag definitions into cache
 */
export function preloadTagDefinitions(tagDefinitions: TagDefinition[]): void {
  tagDefinitions.forEach(td => {
    tagDefinitionCache.set(td.code, td);
  });
} 