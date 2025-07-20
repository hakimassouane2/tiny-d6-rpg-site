import { supabase } from '../lib/supabase';
import { D6Content } from '../types/content';

export async function fetchContent(): Promise<D6Content[]> {
  try {
    const { data, error } = await supabase
      .from('d6_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching content:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
}

export async function addContent(content: Omit<D6Content, 'id' | 'created_at' | 'updated_at'>): Promise<D6Content | null> {
  try {
    const { data, error } = await supabase
      .from('d6_content')
      .insert([content])
      .select()
      .single();

    if (error) {
      console.error('Error adding content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error adding content:', error);
    return null;
  }
}

export async function updateContent(id: string, updates: Partial<D6Content>): Promise<D6Content | null> {
  try {
    const { data, error } = await supabase
      .from('d6_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating content:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
}

export async function deleteContent(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('d6_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting content:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
}
