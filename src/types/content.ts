export type ContentType = "trait" | "object" | "class" | "ancestry";

export interface D6Content {
  id: string;
  name: string;
  type: ContentType;
  description: string | null;
  rules: string | null;
  tags: string[] | null;
  is_hidden: boolean | null;
  markdown_content: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContentFormData {
  name: string;
  type: ContentType;
  description: string;
  rules: string;
  tags: string;
  is_hidden: boolean;
  markdown_content: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  password: string;
}
