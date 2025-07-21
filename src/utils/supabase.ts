import { supabase } from "../lib/supabase";
import {
  Ancestry,
  Class,
  ContentType,
  D6Content,
  Object,
  Spell,
  TagDefinition,
  Trait
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
    case "spell":
      return "spells";
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}

// Fetch all content from all tables
export async function fetchContent(): Promise<D6Content[]> {
  try {
    const allContent: D6Content[] = [];

    // Fetch from each table
    const tables: ContentType[] = ["trait", "object", "class", "ancestry", "spell"];

    for (const type of tables) {
      const tableName = getTableName(type);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("name", { ascending: true });

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

    // Sort all content by name alphabetically
    return allContent.sort((a, b) => a.name.localeCompare(b.name));
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
  try {
    const { data, error } = await supabase
      .from("ancestries")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching ancestries:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching ancestries:", error);
    return [];
  }
}

export async function fetchSpells(): Promise<Spell[]> {
  try {
    const { data, error } = await supabase
      .from("spells")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching spells:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching spells:", error);
    return [];
  }
}

// Tag Definition Management Functions
export async function fetchTagDefinitions(): Promise<TagDefinition[]> {
  const { data, error } = await supabase
    .from("tag_definitions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tag definitions:", error);
    return [];
  }

  return data || [];
}

// Add tag definition
export async function addTagDefinition(
  tagData: Omit<TagDefinition, "id" | "created_at" | "updated_at">
): Promise<TagDefinition | null> {
  try {
    const { data, error } = await supabase
      .from("tag_definitions")
      .insert([tagData])
      .select()
      .single();

    if (error) {
      console.error("Error adding tag definition:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error adding tag definition:", error);
    return null;
  }
}

// Update tag definition
export async function updateTagDefinition(
  id: string,
  tagData: Partial<TagDefinition>
): Promise<TagDefinition | null> {
  try {
    const { data, error } = await supabase
      .from("tag_definitions")
      .update(tagData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating tag definition:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error updating tag definition:", error);
    return null;
  }
}

export async function deleteTagDefinition(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("tag_definitions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting tag definition:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting tag definition:", error);
    return false;
  }
}

export async function getTagDefinitionByCode(
  code: string
): Promise<TagDefinition | null> {
  const { data, error } = await supabase
    .from("tag_definitions")
    .select("*")
    .eq("code", code)
    .single();

  if (error) {
    console.error("Error fetching tag definition by code:", error);
    return null;
  }

  return data;
}
