import { useMemo, useState } from 'react';
import { Idea } from '@/lib/api';

export type SortOption = 'newest' | 'oldest' | 'most_voted' | 'least_voted';

export const useIdeaFilters = (ideas: Idea[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = ideas.filter(idea =>
        idea.text.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        
        case 'most_voted': {
          const aScore = (a.upvotes || 0) - (a.downvotes || 0);
          const bScore = (b.upvotes || 0) - (b.downvotes || 0);
          return bScore - aScore;
        }
        
        case 'least_voted': {
          const aScore = (a.upvotes || 0) - (a.downvotes || 0);
          const bScore = (b.upvotes || 0) - (b.downvotes || 0);
          return aScore - bScore;
        }
        
        default:
          return 0;
      }
    });

    return sorted;
  }, [ideas, searchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredIdeas: filteredAndSortedIdeas,
    totalCount: ideas.length,
    filteredCount: filteredAndSortedIdeas.length,
  };
};
