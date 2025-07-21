-- Create tag_definitions table
CREATE TABLE IF NOT EXISTS tag_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  category TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_tag_definitions_code ON tag_definitions(code);

-- Create index on is_hidden for filtering
CREATE INDEX IF NOT EXISTS idx_tag_definitions_hidden ON tag_definitions(is_hidden);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_tag_definitions_category ON tag_definitions(category);

-- Enable Row Level Security (optional)
ALTER TABLE tag_definitions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations on tag_definitions" ON tag_definitions FOR ALL USING (true);

-- Add all existing tags from tags.ts
INSERT INTO tag_definitions (code, name_en, name_fr, category, is_hidden) VALUES
-- Combat & Weapons
('combat', 'Combat', 'Combat', 'combat', false),
('weapon', 'Weapon', 'Arme', 'combat', false),
('melee', 'Melee', 'Mêlée', 'combat', false),
('ranged', 'Ranged', 'À distance', 'combat', false),
('armor', 'Armor', 'Armure', 'equipment', false),
('shield', 'Shield', 'Bouclier', 'equipment', false),
('firearm', 'Firearm', 'Arme à feu', 'combat', false),
('sword', 'Sword', 'Épée', 'combat', false),
('bow', 'Bow', 'Arc', 'combat', false),
('dagger', 'Dagger', 'Dague', 'combat', false),

-- Magic & Supernatural
('magic', 'Magic', 'Magie', 'magic', false),
('spell', 'Spell', 'Sort', 'magic', false),
('enchantment', 'Enchantment', 'Enchantement', 'magic', false),
('divine', 'Divine', 'Divin', 'magic', false),
('necromancy', 'Necromancy', 'Nécromancie', 'magic', false),
('illusion', 'Illusion', 'Illusion', 'magic', false),
('summoning', 'Summoning', 'Invocation', 'magic', false),
('ritual', 'Ritual', 'Rituel', 'magic', false),
('cursed', 'Cursed', 'Maudit', 'magic', false),
('blessed', 'Blessed', 'Béni', 'magic', false),

-- Skills & Abilities
('stealth', 'Stealth', 'Furtivité', 'skills', false),
('athletics', 'Athletics', 'Athlétisme', 'skills', false),
('acrobatics', 'Acrobatics', 'Acrobatie', 'skills', false),
('survival', 'Survival', 'Survie', 'skills', false),
('healing', 'Healing', 'Soins', 'skills', false),
('crafting', 'Crafting', 'Artisanat', 'skills', false),
('alchemy', 'Alchemy', 'Alchimie', 'skills', false),
('medicine', 'Medicine', 'Médecine', 'skills', false),
('diplomacy', 'Diplomacy', 'Diplomatie', 'skills', false),

-- Equipment & Items
('tool', 'Tool', 'Outil', 'equipment', false),
('consumable', 'Consumable', 'Consommable', 'equipment', false),
('artifact', 'Artifact', 'Artefact', 'equipment', false),
('treasure', 'Treasure', 'Trésor', 'equipment', false),
('potion', 'Potion', 'Potion', 'equipment', false),
('scroll', 'Scroll', 'Parchemin', 'equipment', false),
('gem', 'Gem', 'Gemme', 'equipment', false),
('metal', 'Metal', 'Métal', 'materials', false),
('wood', 'Wood', 'Bois', 'materials', false),
('cloth', 'Cloth', 'Tissu', 'materials', false),

-- Environment & Location
('urban', 'Urban', 'Urbain', 'environment', false),
('wilderness', 'Wilderness', 'Nature sauvage', 'environment', false),
('underground', 'Underground', 'Souterrain', 'environment', false),
('aquatic', 'Aquatic', 'Aquatique', 'environment', false),
('aerial', 'Aerial', 'Aérien', 'environment', false),
('desert', 'Desert', 'Désert', 'environment', false),
('forest', 'Forest', 'Forêt', 'environment', false),
('mountain', 'Mountain', 'Montagne', 'environment', false),
('swamp', 'Swamp', 'Marais', 'environment', false),

-- Social & Roleplay
('noble', 'Noble', 'Noble', 'social', false),
('criminal', 'Criminal', 'Criminel', 'social', false),
('merchant', 'Merchant', 'Marchand', 'social', false),
('religious', 'Religious', 'Religieux', 'social', false),
('military', 'Military', 'Militaire', 'social', false),
('scholar', 'Scholar', 'Érudit', 'social', false),
('entertainer', 'Entertainer', 'Artiste', 'social', false),
('laborer', 'Laborer', 'Ouvrier', 'social', false),

-- Special & Unique
('legendary', 'Legendary', 'Légendaire', 'rarity', false),
('unique', 'Unique', 'Unique', 'rarity', false),
('ancient', 'Ancient', 'Ancien', 'time', false),
('modern', 'Modern', 'Moderne', 'time', false),
('futuristic', 'Futuristic', 'Futuriste', 'time', false),
('cosmic', 'Cosmic', 'Cosmique', 'magic', false),
('elemental', 'Elemental', 'Élémentaire', 'magic', false),
('temporal', 'Temporal', 'Temporel', 'magic', false),
('dimensional', 'Dimensional', 'Dimensionnel', 'magic', false),

-- Additional Combat & Weapons
('axe', 'Axe', 'Hache', 'combat', false),
('hammer', 'Hammer', 'Marteau', 'combat', false),
('spear', 'Spear', 'Lance', 'combat', false),
('crossbow', 'Crossbow', 'Arbalète', 'combat', false),
('throwing', 'Throwing', 'Lancer', 'combat', false),
('blunt', 'Blunt', 'Contondant', 'combat', false),
('piercing', 'Piercing', 'Perforant', 'combat', false),
('slashing', 'Slashing', 'Tranchant', 'combat', false),
('defensive', 'Defensive', 'Défensif', 'combat', false),
('offensive', 'Offensive', 'Offensif', 'combat', false),

-- Additional Magic & Supernatural
('conjuration', 'Conjuration', 'Conjuration', 'magic', false),
('evocation', 'Evocation', 'Évocation', 'magic', false),
('abjuration', 'Abjuration', 'Abjuration', 'magic', false),
('transmutation', 'Transmutation', 'Transmutation', 'magic', false),
('divination', 'Divination', 'Divination', 'magic', false),
('charm', 'Charm', 'Charme', 'magic', false),
('hex', 'Hex', 'Maléfice', 'magic', false),
('ward', 'Ward', 'Protection', 'magic', false),
('binding', 'Binding', 'Lien', 'magic', false),
('banishment', 'Banishment', 'Bannissement', 'magic', false),

-- Additional Skills & Abilities
('intimidation', 'Intimidation', 'Intimidation', 'skills', false),
('persuasion', 'Persuasion', 'Persuasion', 'skills', false),
('deception', 'Deception', 'Tromperie', 'skills', false),
('insight', 'Insight', 'Intuition', 'skills', false),
('investigation', 'Investigation', 'Enquête', 'skills', false),
('perception', 'Perception', 'Perception', 'skills', false),
('sleight', 'Sleight of Hand', 'Prestidigitation', 'skills', false),
('animal', 'Animal Handling', 'Dressage', 'skills', false),
('nature', 'Nature', 'Nature', 'skills', false),
('history', 'History', 'Histoire', 'skills', false),

-- Additional Equipment & Items
('container', 'Container', 'Conteneur', 'equipment', false),
('clothing', 'Clothing', 'Vêtement', 'equipment', false),
('jewelry', 'Jewelry', 'Bijou', 'equipment', false),
('currency', 'Currency', 'Monnaie', 'equipment', false),
('document', 'Document', 'Document', 'equipment', false),
('key', 'Key', 'Clé', 'equipment', false),
('lockpick', 'Lockpick', 'Crochet', 'equipment', false),
('torch', 'Torch', 'Torche', 'equipment', false),
('rope', 'Rope', 'Corde', 'equipment', false),
('backpack', 'Backpack', 'Sac à dos', 'equipment', false),
('instrument', 'Instrument', 'Instrument', 'equipment', false),

-- Additional Environment & Location
('castle', 'Castle', 'Château', 'environment', false),
('dungeon', 'Dungeon', 'Donjon', 'environment', false),
('temple', 'Temple', 'Temple', 'environment', false),
('tavern', 'Tavern', 'Taverne', 'environment', false),
('market', 'Market', 'Marché', 'environment', false),
('library', 'Library', 'Bibliothèque', 'environment', false),
('laboratory', 'Laboratory', 'Laboratoire', 'environment', false),
('prison', 'Prison', 'Prison', 'environment', false),
('cemetery', 'Cemetery', 'Cimetière', 'environment', false),
('bridge', 'Bridge', 'Pont', 'environment', false),

-- Additional Social & Roleplay
('royalty', 'Royalty', 'Royauté', 'social', false),
('peasant', 'Peasant', 'Paysan', 'social', false),
('guard', 'Guard', 'Garde', 'social', false),
('assassin', 'Assassin', 'Assassin', 'social', false),
('spy', 'Spy', 'Espion', 'social', false),
('healer', 'Healer', 'Guérisseur', 'social', false),
('blacksmith', 'Blacksmith', 'Forgeron', 'social', false),
('carpenter', 'Carpenter', 'Charpentier', 'social', false),
('farmer', 'Farmer', 'Fermier', 'social', false),
('fisherman', 'Fisherman', 'Pêcheur', 'social', false),

-- Additional Special & Unique
('mythical', 'Mythical', 'Mythique', 'rarity', false),
('sentient', 'Sentient', 'Conscient', 'magic', false),
('intelligent', 'Intelligent', 'Intelligent', 'magic', false),
('living', 'Living', 'Vivant', 'magic', false),
('undead', 'Undead', 'Mort-vivant', 'magic', false),
('construct', 'Construct', 'Construction', 'magic', false),
('outsider', 'Outsider', 'Étranger', 'magic', false),
('aberration', 'Aberration', 'Aberration', 'magic', false),

-- Additional Combat & Tactics
('ambush', 'Ambush', 'Embuscade', 'combat', false),
('retreat', 'Retreat', 'Retraite', 'combat', false),
('flanking', 'Flanking', 'Enveloppement', 'combat', false),
('cover', 'Cover', 'Couverture', 'combat', false),
('concealment', 'Concealment', 'Dissimulation', 'combat', false),
('trap', 'Trap', 'Piège', 'combat', false),
('alarm', 'Alarm', 'Alarme', 'combat', false),
('fortification', 'Fortification', 'Fortification', 'combat', false),
('siege', 'Siege', 'Siège', 'combat', false),
('naval', 'Naval', 'Naval', 'combat', false),

-- Additional Magic & Effects
('buff', 'Buff', 'Amélioration', 'magic', false),
('debuff', 'Debuff', 'Affaiblissement', 'magic', false),
('damage', 'Damage', 'Dégâts', 'magic', false),
('protection', 'Protection', 'Protection', 'magic', false),
('resistance', 'Resistance', 'Résistance', 'magic', false),
('immunity', 'Immunity', 'Immunité', 'magic', false),
('vulnerability', 'Vulnerability', 'Vulnérabilité', 'magic', false),
('enhancement', 'Enhancement', 'Amélioration', 'magic', false),
('transformation', 'Transformation', 'Transformation', 'magic', false),

-- Additional Materials & Crafting
('leather', 'Leather', 'Cuir', 'materials', false),
('stone', 'Stone', 'Pierre', 'materials', false),
('crystal', 'Crystal', 'Cristal', 'materials', false),
('bone', 'Bone', 'Os', 'materials', false),
('feather', 'Feather', 'Plume', 'materials', false),
('scale', 'Scale', 'Écaille', 'materials', false),
('silk', 'Silk', 'Soie', 'materials', false),
('wool', 'Wool', 'Laine', 'materials', false),
('paper', 'Paper', 'Papier', 'materials', false),
('parchment', 'Parchment', 'Parchemin', 'materials', false),

-- Additional Elements & Nature
('fire', 'Fire', 'Feu', 'elements', false),
('water', 'Water', 'Eau', 'elements', false),
('earth', 'Earth', 'Terre', 'elements', false),
('air', 'Air', 'Air', 'elements', false),
('lightning', 'Lightning', 'Éclair', 'elements', false),
('ice', 'Ice', 'Glace', 'elements', false),
('poison', 'Poison', 'Poison', 'elements', false),
('acid', 'Acid', 'Acide', 'elements', false),
('radiant', 'Radiant', 'Radieux', 'elements', false),
('necrotic', 'Necrotic', 'Nécrotique', 'elements', false),

-- Additional Time & Duration
('instant', 'Instant', 'Instantané', 'time', false),
('temporary', 'Temporary', 'Temporaire', 'time', false),
('permanent', 'Permanent', 'Permanent', 'time', false),
('recharge', 'Recharge', 'Recharge', 'time', false),
('cooldown', 'Cooldown', 'Temps de recharge', 'time', false),
('duration', 'Duration', 'Durée', 'time', false),
('concentration', 'Concentration', 'Concentration', 'time', false),
('preparation', 'Preparation', 'Préparation', 'time', false),
('maintenance', 'Maintenance', 'Entretien', 'time', false),

-- Additional Rarity & Value
('common', 'Common', 'Commun', 'rarity', false),
('uncommon', 'Uncommon', 'Peu commun', 'rarity', false),
('rare', 'Rare', 'Rare', 'rarity', false),
('very_rare', 'Very Rare', 'Très rare', 'rarity', false),
('epic', 'Epic', 'Épique', 'rarity', false),
('masterwork', 'Masterwork', 'Chef-d''œuvre', 'rarity', false),
('mundane', 'Mundane', 'Mondain', 'rarity', false),
('exotic', 'Exotic', 'Exotique', 'rarity', false),
('forbidden', 'Forbidden', 'Interdit', 'rarity', false),
('sacred', 'Sacred', 'Sacré', 'rarity', false),

-- Additional Function & Purpose
('utility', 'Utility', 'Utilitaire', 'function', false),
('luxury', 'Luxury', 'Luxe', 'function', false),
('necessity', 'Necessity', 'Nécessité', 'function', false),
('decoration', 'Decoration', 'Décoration', 'function', false),
('communication', 'Communication', 'Communication', 'function', false),
('transportation', 'Transportation', 'Transport', 'function', false),
('storage', 'Storage', 'Stockage', 'function', false),
('lighting', 'Lighting', 'Éclairage', 'function', false),
('cooking', 'Cooking', 'Cuisine', 'function', false),
('cleaning', 'Cleaning', 'Nettoyage', 'function', false),

-- Additional Size & Scale
('tiny', 'Tiny', 'Minuscule', 'size', false),
('small', 'Small', 'Petit', 'size', false),
('medium', 'Medium', 'Moyen', 'size', false),
('large', 'Large', 'Grand', 'size', false),
('huge', 'Huge', 'Énorme', 'size', false),
('gargantuan', 'Gargantuan', 'Gargantuesque', 'size', false),
('portable', 'Portable', 'Portable', 'size', false),
('stationary', 'Stationary', 'Stationnaire', 'size', false),
('wearable', 'Wearable', 'Portable', 'size', false),
('wieldable', 'Wieldable', 'Manipulable', 'size', false),

-- Additional Condition & State
('broken', 'Broken', 'Cassé', 'condition', false),
('damaged', 'Damaged', 'Endommagé', 'condition', false),
('pristine', 'Pristine', 'Parfait', 'condition', false),
('worn', 'Worn', 'Usé', 'condition', false),
('new', 'New', 'Neuf', 'condition', false),
('old', 'Old', 'Vieux', 'condition', false),
('hot', 'Hot', 'Chaud', 'condition', false),
('cold', 'Cold', 'Froid', 'condition', false),
('wet', 'Wet', 'Mouillé', 'condition', false),
('dry', 'Dry', 'Sec', 'condition', false),

-- Additional Origin & Source
('dwarven', 'Dwarven', 'Nain', 'origin', false),
('elven', 'Elven', 'Elfe', 'origin', false),
('human', 'Human', 'Humain', 'origin', false),
('orcish', 'Orcish', 'Orque', 'origin', false),
('goblin', 'Goblin', 'Gobelin', 'origin', false),
('dragon', 'Dragon', 'Dragon', 'origin', false),
('celestial', 'Celestial', 'Céleste', 'origin', false),
('infernal', 'Infernal', 'Infernal', 'origin', false),
('fey', 'Fey', 'Féerique', 'origin', false),
('aberrant', 'Aberrant', 'Aberrant', 'origin', false),

-- Additional Technology & Innovation
('mechanical', 'Mechanical', 'Mécanique', 'technology', false),
('electrical', 'Electrical', 'Électrique', 'technology', false),
('steam', 'Steam', 'Vapeur', 'technology', false),
('clockwork', 'Clockwork', 'Horlogerie', 'technology', false),
('alchemical', 'Alchemical', 'Alchimique', 'technology', false),
('runed', 'Runed', 'Runique', 'magic', false),
('enchanted', 'Enchanted', 'Enchanté', 'magic', false),
('infused', 'Infused', 'Infusé', 'magic', false),
('imbued', 'Imbued', 'Imprégné', 'magic', false),
('attuned', 'Attuned', 'Harmonisé', 'magic', false); 

-- Add requirement field to d6_content table
ALTER TABLE d6_content ADD COLUMN requirement TEXT;

-- Update existing traits to have NULL requirement (optional field)
-- This ensures existing traits don't break
UPDATE d6_content SET requirement = NULL WHERE requirement IS NULL;

-- Add comment to document the field
COMMENT ON COLUMN d6_content.requirement IS 'Prerequisite trait, class, or ancestry needed to take this trait'; 