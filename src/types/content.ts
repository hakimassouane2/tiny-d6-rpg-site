export type ContentType = "trait" | "object" | "class" | "ancestry" | "spell";

// Base interface for common fields
export interface BaseContent {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  created_at?: string;
  updated_at?: string;
}

// Specific interfaces for each content type
export interface Trait extends BaseContent {
  type: "trait";
  requirement: string | null;
}

export interface Object extends BaseContent {
  type: "object";
  rules: string | null;
}

export interface Class extends BaseContent {
  type: "class";
}

export interface Ancestry extends BaseContent {
  type: "ancestry";
  base_hp: number;
  base_ac: number;
  base_trait: string;
}

export interface Spell extends BaseContent {
  type: "spell";
  spell_level: "minor" | "major";
  rules: string | null;
}

// New tag definition interface for admin management
export interface TagDefinition {
  id: string;
  code: string; // slug/identifier
  name_en: string;
  name_fr: string;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

// Union type for all content
export type D6Content = Trait | Object | Class | Ancestry | Spell;

export interface ContentFormData {
  name: string;
  type: ContentType;
  description: string;
  tags: string;
  rules?: string;
  requirement?: string;
  spell_level?: "minor" | "major";
  base_hp?: number;
  base_ac?: number;
  base_trait?: string;
}

// New tag definition form data
export interface TagDefinitionFormData {
  code: string;
  name_en: string;
  name_fr: string;
  category: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  password: string;
}
