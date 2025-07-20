export interface TagTranslation {
  en: string;
  fr: string;
}

export const TAGS: Record<string, TagTranslation> = {
  // Combat & Weapons
  combat: { en: "Combat", fr: "Combat" },
  weapon: { en: "Weapon", fr: "Arme" },
  melee: { en: "Melee", fr: "Mêlée" },
  ranged: { en: "Ranged", fr: "À distance" },
  armor: { en: "Armor", fr: "Armure" },
  shield: { en: "Shield", fr: "Bouclier" },
  firearm: { en: "Firearm", fr: "Arme à feu" },
  sword: { en: "Sword", fr: "Épée" },
  bow: { en: "Bow", fr: "Arc" },
  dagger: { en: "Dagger", fr: "Dague" },

  // Magic & Supernatural
  magic: { en: "Magic", fr: "Magie" },
  spell: { en: "Spell", fr: "Sort" },
  enchantment: { en: "Enchantment", fr: "Enchantement" },
  divine: { en: "Divine", fr: "Divin" },
  necromancy: { en: "Necromancy", fr: "Nécromancie" },
  illusion: { en: "Illusion", fr: "Illusion" },
  summoning: { en: "Summoning", fr: "Invocation" },
  ritual: { en: "Ritual", fr: "Rituel" },
  cursed: { en: "Cursed", fr: "Maudit" },
  blessed: { en: "Blessed", fr: "Béni" },

  // Skills & Abilities
  stealth: { en: "Stealth", fr: "Furtivité" },
  athletics: { en: "Athletics", fr: "Athlétisme" },
  acrobatics: { en: "Acrobatics", fr: "Acrobatie" },
  survival: { en: "Survival", fr: "Survie" },
  healing: { en: "Healing", fr: "Soins" },
  crafting: { en: "Crafting", fr: "Artisanat" },
  alchemy: { en: "Alchemy", fr: "Alchimie" },
  medicine: { en: "Medicine", fr: "Médecine" },
  diplomacy: { en: "Diplomacy", fr: "Diplomatie" },

  // Equipment & Items
  tool: { en: "Tool", fr: "Outil" },
  consumable: { en: "Consumable", fr: "Consommable" },
  artifact: { en: "Artifact", fr: "Artefact" },
  treasure: { en: "Treasure", fr: "Trésor" },
  potion: { en: "Potion", fr: "Potion" },
  scroll: { en: "Scroll", fr: "Parchemin" },
  gem: { en: "Gem", fr: "Gemme" },
  metal: { en: "Metal", fr: "Métal" },
  wood: { en: "Wood", fr: "Bois" },
  cloth: { en: "Cloth", fr: "Tissu" },

  // Environment & Location
  urban: { en: "Urban", fr: "Urbain" },
  wilderness: { en: "Wilderness", fr: "Nature sauvage" },
  underground: { en: "Underground", fr: "Souterrain" },
  aquatic: { en: "Aquatic", fr: "Aquatique" },
  aerial: { en: "Aerial", fr: "Aérien" },
  desert: { en: "Desert", fr: "Désert" },
  forest: { en: "Forest", fr: "Forêt" },
  mountain: { en: "Mountain", fr: "Montagne" },
  swamp: { en: "Swamp", fr: "Marais" },

  // Social & Roleplay
  noble: { en: "Noble", fr: "Noble" },
  criminal: { en: "Criminal", fr: "Criminel" },
  merchant: { en: "Merchant", fr: "Marchand" },
  religious: { en: "Religious", fr: "Religieux" },
  military: { en: "Military", fr: "Militaire" },
  scholar: { en: "Scholar", fr: "Érudit" },
  entertainer: { en: "Entertainer", fr: "Artiste" },
  laborer: { en: "Laborer", fr: "Ouvrier" },

  // Special & Unique
  legendary: { en: "Legendary", fr: "Légendaire" },
  unique: { en: "Unique", fr: "Unique" },
  ancient: { en: "Ancient", fr: "Ancien" },
  modern: { en: "Modern", fr: "Moderne" },
  futuristic: { en: "Futuristic", fr: "Futuriste" },
  cosmic: { en: "Cosmic", fr: "Cosmique" },
  elemental: { en: "Elemental", fr: "Élémentaire" },
  temporal: { en: "Temporal", fr: "Temporel" },
  dimensional: { en: "Dimensional", fr: "Dimensionnel" },

  // Additional Combat & Weapons
  axe: { en: "Axe", fr: "Hache" },
  hammer: { en: "Hammer", fr: "Marteau" },
  spear: { en: "Spear", fr: "Lance" },
  crossbow: { en: "Crossbow", fr: "Arbalète" },
  throwing: { en: "Throwing", fr: "Lancer" },
  blunt: { en: "Blunt", fr: "Contondant" },
  piercing: { en: "Piercing", fr: "Perforant" },
  slashing: { en: "Slashing", fr: "Tranchant" },
  defensive: { en: "Defensive", fr: "Défensif" },
  offensive: { en: "Offensive", fr: "Offensif" },

  // Additional Magic & Supernatural
  conjuration: { en: "Conjuration", fr: "Conjuration" },
  evocation: { en: "Evocation", fr: "Évocation" },
  abjuration: { en: "Abjuration", fr: "Abjuration" },
  transmutation: { en: "Transmutation", fr: "Transmutation" },
  divination: { en: "Divination", fr: "Divination" },
  charm: { en: "Charm", fr: "Charme" },
  hex: { en: "Hex", fr: "Maléfice" },
  ward: { en: "Ward", fr: "Protection" },
  binding: { en: "Binding", fr: "Lien" },
  banishment: { en: "Banishment", fr: "Bannissement" },

  // Additional Skills & Abilities
  intimidation: { en: "Intimidation", fr: "Intimidation" },
  persuasion: { en: "Persuasion", fr: "Persuasion" },
  deception: { en: "Deception", fr: "Tromperie" },
  insight: { en: "Insight", fr: "Intuition" },
  investigation: { en: "Investigation", fr: "Enquête" },
  perception: { en: "Perception", fr: "Perception" },
  sleight: { en: "Sleight of Hand", fr: "Prestidigitation" },
  animal: { en: "Animal Handling", fr: "Dressage" },
  nature: { en: "Nature", fr: "Nature" },
  history: { en: "History", fr: "Histoire" },

  // Additional Equipment & Items
  container: { en: "Container", fr: "Conteneur" },
  clothing: { en: "Clothing", fr: "Vêtement" },
  jewelry: { en: "Jewelry", fr: "Bijou" },
  currency: { en: "Currency", fr: "Monnaie" },
  document: { en: "Document", fr: "Document" },
  key: { en: "Key", fr: "Clé" },
  lockpick: { en: "Lockpick", fr: "Crochet" },
  torch: { en: "Torch", fr: "Torche" },
  rope: { en: "Rope", fr: "Corde" },
  backpack: { en: "Backpack", fr: "Sac à dos" },

  // Additional Environment & Location
  castle: { en: "Castle", fr: "Château" },
  dungeon: { en: "Dungeon", fr: "Donjon" },
  temple: { en: "Temple", fr: "Temple" },
  tavern: { en: "Tavern", fr: "Taverne" },
  market: { en: "Market", fr: "Marché" },
  library: { en: "Library", fr: "Bibliothèque" },
  laboratory: { en: "Laboratory", fr: "Laboratoire" },
  prison: { en: "Prison", fr: "Prison" },
  cemetery: { en: "Cemetery", fr: "Cimetière" },
  bridge: { en: "Bridge", fr: "Pont" },

  // Additional Social & Roleplay
  royalty: { en: "Royalty", fr: "Royauté" },
  peasant: { en: "Peasant", fr: "Paysan" },
  guard: { en: "Guard", fr: "Garde" },
  assassin: { en: "Assassin", fr: "Assassin" },
  spy: { en: "Spy", fr: "Espion" },
  healer: { en: "Healer", fr: "Guérisseur" },
  blacksmith: { en: "Blacksmith", fr: "Forgeron" },
  carpenter: { en: "Carpenter", fr: "Charpentier" },
  farmer: { en: "Farmer", fr: "Fermier" },
  fisherman: { en: "Fisherman", fr: "Pêcheur" },

  // Additional Special & Unique
  mythical: { en: "Mythical", fr: "Mythique" },
  sentient: { en: "Sentient", fr: "Conscient" },
  intelligent: { en: "Intelligent", fr: "Intelligent" },
  living: { en: "Living", fr: "Vivant" },
  undead: { en: "Undead", fr: "Mort-vivant" },
  construct: { en: "Construct", fr: "Construction" },
  outsider: { en: "Outsider", fr: "Étranger" },
  aberration: { en: "Aberration", fr: "Aberration" },

  // Additional Combat & Tactics
  ambush: { en: "Ambush", fr: "Embuscade" },
  retreat: { en: "Retreat", fr: "Retraite" },
  flanking: { en: "Flanking", fr: "Enveloppement" },
  cover: { en: "Cover", fr: "Couverture" },
  concealment: { en: "Concealment", fr: "Dissimulation" },
  trap: { en: "Trap", fr: "Piège" },
  alarm: { en: "Alarm", fr: "Alarme" },
  fortification: { en: "Fortification", fr: "Fortification" },
  siege: { en: "Siege", fr: "Siège" },
  naval: { en: "Naval", fr: "Naval" },

  // Additional Magic & Effects
  buff: { en: "Buff", fr: "Amélioration" },
  debuff: { en: "Debuff", fr: "Affaiblissement" },
  damage: { en: "Damage", fr: "Dégâts" },
  protection: { en: "Protection", fr: "Protection" },
  resistance: { en: "Resistance", fr: "Résistance" },
  immunity: { en: "Immunity", fr: "Immunité" },
  vulnerability: { en: "Vulnerability", fr: "Vulnérabilité" },
  enhancement: { en: "Enhancement", fr: "Amélioration" },
  transformation: { en: "Transformation", fr: "Transformation" },

  // Additional Materials & Crafting
  leather: { en: "Leather", fr: "Cuir" },
  stone: { en: "Stone", fr: "Pierre" },
  crystal: { en: "Crystal", fr: "Cristal" },
  bone: { en: "Bone", fr: "Os" },
  feather: { en: "Feather", fr: "Plume" },
  scale: { en: "Scale", fr: "Écaille" },
  silk: { en: "Silk", fr: "Soie" },
  wool: { en: "Wool", fr: "Laine" },
  paper: { en: "Paper", fr: "Papier" },
  parchment: { en: "Parchment", fr: "Parchemin" },

  // Additional Elements & Nature
  fire: { en: "Fire", fr: "Feu" },
  water: { en: "Water", fr: "Eau" },
  earth: { en: "Earth", fr: "Terre" },
  air: { en: "Air", fr: "Air" },
  lightning: { en: "Lightning", fr: "Éclair" },
  ice: { en: "Ice", fr: "Glace" },
  poison: { en: "Poison", fr: "Poison" },
  acid: { en: "Acid", fr: "Acide" },
  radiant: { en: "Radiant", fr: "Radieux" },
  necrotic: { en: "Necrotic", fr: "Nécrotique" },

  // Additional Time & Duration
  instant: { en: "Instant", fr: "Instantané" },
  temporary: { en: "Temporary", fr: "Temporaire" },
  permanent: { en: "Permanent", fr: "Permanent" },
  recharge: { en: "Recharge", fr: "Recharge" },
  cooldown: { en: "Cooldown", fr: "Temps de recharge" },
  duration: { en: "Duration", fr: "Durée" },
  concentration: { en: "Concentration", fr: "Concentration" },
  preparation: { en: "Preparation", fr: "Préparation" },
  maintenance: { en: "Maintenance", fr: "Entretien" },

  // Additional Rarity & Value
  common: { en: "Common", fr: "Commun" },
  uncommon: { en: "Uncommon", fr: "Peu commun" },
  rare: { en: "Rare", fr: "Rare" },
  very_rare: { en: "Very Rare", fr: "Très rare" },
  epic: { en: "Epic", fr: "Épique" },
  masterwork: { en: "Masterwork", fr: "Chef-d'œuvre" },
  mundane: { en: "Mundane", fr: "Mondain" },
  exotic: { en: "Exotic", fr: "Exotique" },
  forbidden: { en: "Forbidden", fr: "Interdit" },
  sacred: { en: "Sacred", fr: "Sacré" },

  // Additional Function & Purpose
  utility: { en: "Utility", fr: "Utilitaire" },
  luxury: { en: "Luxury", fr: "Luxe" },
  necessity: { en: "Necessity", fr: "Nécessité" },
  decoration: { en: "Decoration", fr: "Décoration" },
  communication: { en: "Communication", fr: "Communication" },
  transportation: { en: "Transportation", fr: "Transport" },
  storage: { en: "Storage", fr: "Stockage" },
  lighting: { en: "Lighting", fr: "Éclairage" },
  cooking: { en: "Cooking", fr: "Cuisine" },
  cleaning: { en: "Cleaning", fr: "Nettoyage" },

  // Additional Size & Scale
  tiny: { en: "Tiny", fr: "Minuscule" },
  small: { en: "Small", fr: "Petit" },
  medium: { en: "Medium", fr: "Moyen" },
  large: { en: "Large", fr: "Grand" },
  huge: { en: "Huge", fr: "Énorme" },
  gargantuan: { en: "Gargantuan", fr: "Gargantuesque" },
  portable: { en: "Portable", fr: "Portable" },
  stationary: { en: "Stationary", fr: "Stationnaire" },
  wearable: { en: "Wearable", fr: "Portable" },
  wieldable: { en: "Wieldable", fr: "Manipulable" },

  // Additional Condition & State
  broken: { en: "Broken", fr: "Cassé" },
  damaged: { en: "Damaged", fr: "Endommagé" },
  pristine: { en: "Pristine", fr: "Parfait" },
  worn: { en: "Worn", fr: "Usé" },
  new: { en: "New", fr: "Neuf" },
  old: { en: "Old", fr: "Vieux" },
  hot: { en: "Hot", fr: "Chaud" },
  cold: { en: "Cold", fr: "Froid" },
  wet: { en: "Wet", fr: "Mouillé" },
  dry: { en: "Dry", fr: "Sec" },

  // Additional Origin & Source
  dwarven: { en: "Dwarven", fr: "Nain" },
  elven: { en: "Elven", fr: "Elfe" },
  human: { en: "Human", fr: "Humain" },
  orcish: { en: "Orcish", fr: "Orque" },
  goblin: { en: "Goblin", fr: "Gobelin" },
  dragon: { en: "Dragon", fr: "Dragon" },
  celestial: { en: "Celestial", fr: "Céleste" },
  infernal: { en: "Infernal", fr: "Infernal" },
  fey: { en: "Fey", fr: "Féerique" },
  aberrant: { en: "Aberrant", fr: "Aberrant" },

  // Additional Technology & Innovation
  mechanical: { en: "Mechanical", fr: "Mécanique" },
  electrical: { en: "Electrical", fr: "Électrique" },
  steam: { en: "Steam", fr: "Vapeur" },
  clockwork: { en: "Clockwork", fr: "Horlogerie" },
  alchemical: { en: "Alchemical", fr: "Alchimique" },
  runed: { en: "Runed", fr: "Runique" },
  enchanted: { en: "Enchanted", fr: "Enchanté" },
  infused: { en: "Infused", fr: "Infusé" },
  imbued: { en: "Imbued", fr: "Imprégné" },
  attuned: { en: "Attuned", fr: "Harmonisé" },
};

export const TAG_KEYS = Object.keys(TAGS);

export function getTagTranslation(
  tagKey: string,
  language: "en" | "fr"
): string {
  return TAGS[tagKey]?.[language] || tagKey;
}

export function getAllTagTranslations(language: "en" | "fr"): string[] {
  return Object.values(TAGS).map((tag) => tag[language]);
}

export function findTagByTranslation(
  translation: string,
  language: "en" | "fr"
): string | null {
  const entry = Object.entries(TAGS).find(([key, tag]) =>
    tag[language].toLowerCase().includes(translation.toLowerCase())
  );
  return entry ? entry[0] : null;
}
