/**
 * Normalizes text by removing diacritics for comparison purposes
 * @param text - The text to normalize
 * @returns The normalized text without diacritics
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase();
}

/**
 * Checks if a text contains a search term, ignoring diacritics
 * @param text - The text to search in
 * @param searchTerm - The search term to look for
 * @returns True if the text contains the search term (ignoring diacritics)
 */
export function containsIgnoreDiacritics(
  text: string,
  searchTerm: string
): boolean {
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);
  return normalizedText.includes(normalizedSearch);
}

/**
 * Checks if a text starts with a search term, ignoring diacritics
 * @param text - The text to check
 * @param searchTerm - The search term to look for
 * @returns True if the text starts with the search term (ignoring diacritics)
 */
export function startsWithIgnoreDiacritics(
  text: string,
  searchTerm: string
): boolean {
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(searchTerm);
  return normalizedText.startsWith(normalizedSearch);
}
