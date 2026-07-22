import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PortfolioContent {
  id: string;
  type: 'certificate' | 'video' | 'website';
  title: string;
  description: string | null;
  media_url: string | null;
  external_link: string | null;
  tags: string[] | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export const usePortfolioContent = (includeHidden: boolean = false) => {
  const [content, setContent] = useState<PortfolioContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching portfolio content:', error);
        setError(error as any);
        setContent([]);
        return;
      }

      let filteredData = (data || []) as PortfolioContent[];

      if (!includeHidden) {
        filteredData = filteredData.filter(item => item.is_visible);
      }

      setContent(filteredData);
    } catch (err) {
      console.error('Unexpected error fetching portfolio content:', err);
      setError(err as Error);
      setContent([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    const channel = supabase
      .channel('portfolio_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_content',
        },
        () => {
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [includeHidden]);

  const createContent = async (newContent: Omit<PortfolioContent, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('portfolio_content')
      .insert(newContent)
      .select()
      .single();

    if (error) throw error;
    
    await fetchContent();
    return data as PortfolioContent;
  };

  const updateContent = async (id: string, updates: Partial<PortfolioContent>) => {
    const { data, error } = await supabase
      .from('portfolio_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    await fetchContent();
    return data as PortfolioContent;
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase
      .from('portfolio_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await fetchContent();
  };

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    return updateContent(id, { is_visible: isVisible });
  };

  return {
    content,
    isLoading,
    error,
    refetch: fetchContent,
    createContent,
    updateContent,
    deleteContent,
    toggleVisibility,
  };
};
