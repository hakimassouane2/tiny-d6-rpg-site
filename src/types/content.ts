export type ContentType =
  | "trait"
  | "object"
  | "class"
  | "ancestry"
  | "trap"
  | "monster";

// Base interface for common fields
export interface BaseContent {
  id: string;
  name: string;
  description: string | null;
  rules: string | null;
  tags: string[] | null;
  is_hidden: boolean | null;
  created_at?: string;
  updated_at?: string;
}

// Specific interfaces for each content type
export interface Trait extends BaseContent {
  type: "trait";
}

export interface Object extends BaseContent {
  type: "object";
}

export interface Class extends BaseContent {
  type: "class";
}

export interface Ancestry extends BaseContent {
  type: "ancestry";
}

export interface Trap extends BaseContent {
  type: "trap";
}

export interface Monster extends BaseContent {
  type: "monster";
}

// Union type for all content
export type D6Content = Trait | Object | Class | Ancestry | Trap | Monster;

export interface ContentFormData {
  name: string;
  type: ContentType;
  description: string;
  rules: string;
  tags: string;
  is_hidden: boolean;
}

export interface AdminState {
  isLoggedIn: boolean;
  password: string;
}
