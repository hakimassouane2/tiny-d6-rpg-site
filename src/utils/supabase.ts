import { supabase } from "../lib/supabase";
import {
  Ancestry,
  Class,
  ContentType,
  D6Content,
  Object,
  Trait,
} from "../types/content";

// Generic function to get table name from content type
function getTableName(type: ContentType): string {
  switch (type) {
    case "trait":
      return "traits";
    case "object":
      return "objects";
    case "class":
      return "classes";
    case "ancestry":
      return "ancestries";
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}

// Fetch all content from all tables
export async function fetchContent(): Promise<D6Content[]> {
  try {
    const allContent: D6Content[] = [];

    // Fetch from each table
    const tables: ContentType[] = ["trait", "object", "class", "ancestry"];

    for (const type of tables) {
      const tableName = getTableName(type);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(`Error fetching ${type} content:`, error);
        continue;
      }

      if (data) {
        // Add type field to each item
        const typedData = data.map((item) => ({ ...item, type }));
        allContent.push(...typedData);
      }
    }

    // Sort all content by created_at
    return allContent.sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
    );
  } catch (error) {
    console.error("Error fetching content:", error);
    return [];
  }
}

// Add content to the appropriate table
export async function addContent(
  content: Omit<D6Content, "id" | "created_at" | "updated_at">
): Promise<D6Content | null> {
  try {
    const tableName = getTableName(content.type);

    // Remove type field before inserting (it's not stored in the table)
    const { type, ...contentWithoutType } = content;

    const { data, error } = await supabase
      .from(tableName)
      .insert([contentWithoutType])
      .select()
      .single();

    if (error) {
      console.error(`Error adding ${content.type} content:`, error);
      return null;
    }

    // Add type field back to the returned data
    return { ...data, type };
  } catch (error) {
    console.error(`Error adding ${content.type} content:`, error);
    return null;
  }
}

// Update content in the appropriate table
export async function updateContent(
  id: string,
  updates: Partial<D6Content>
): Promise<D6Content | null> {
  try {
    const { type, ...updatesWithoutType } = updates;

    if (!type) {
      console.error("Type is required for update");
      return null;
    }

    const tableName = getTableName(type);

    const { data, error } = await supabase
      .from(tableName)
      .update(updatesWithoutType)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${type} content:`, error);
      return null;
    }

    // Add type field back to the returned data
    return { ...data, type };
  } catch (error) {
    console.error("Error updating content:", error);
    return null;
  }
}

// Delete content from the appropriate table
export async function deleteContent(
  id: string,
  type: ContentType
): Promise<boolean> {
  try {
    const tableName = getTableName(type);

    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      console.error(`Error deleting ${type} content:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting content:", error);
    return false;
  }
}

// Type-specific fetch functions
export async function fetchTraits(): Promise<Trait[]> {
  const { data, error } = await supabase
    .from("traits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching traits:", error);
    return [];
  }

  return data?.map((item) => ({ ...item, type: "trait" as const })) || [];
}

export async function fetchObjects(): Promise<Object[]> {
  const { data, error } = await supabase
    .from("objects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching objects:", error);
    return [];
  }

  return data?.map((item) => ({ ...item, type: "object" as const })) || [];
}

export async function fetchClasses(): Promise<Class[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching classes:", error);
    return [];
  }

  return data?.map((item) => ({ ...item, type: "class" as const })) || [];
}

export async function fetchAncestries(): Promise<Ancestry[]> {
  const { data, error } = await supabase
    .from("ancestries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ancestries:", error);
    return [];
  }

  return data?.map((item) => ({ ...item, type: "ancestry" as const })) || [];
}
