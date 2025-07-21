export const getSpellLevelTranslation = (spellLevel: string, language: string) => {
  switch (language) {
    case "en":
      return spellLevel === "minor" ? "Minor" : "Major";
    case "fr":
      return spellLevel === "minor" ? "Mineur" : "Majeur";
  }
};