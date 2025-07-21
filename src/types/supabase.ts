export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      d6_content: {
        Row: {
          id: string;
          name: string;
          type: "trait" | "object" | "class" | "ancestry";
          description: string | null;
          rules: string | null;
          requirement: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "trait" | "object" | "class" | "ancestry";
          description?: string | null;
          rules?: string | null;
          requirement?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "trait" | "object" | "class" | "ancestry";
          description?: string | null;
          rules?: string | null;
          requirement?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tag_definitions: {
        Row: {
          id: string;
          code: string;
          name_en: string;
          name_fr: string;
          category: string | null;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_en: string;
          name_fr: string;
          category?: string | null;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_en?: string;
          name_fr?: string;
          category?: string | null;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
