'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Search } from 'lucide-react';
import { Idea } from '@/lib/api';
import { IdeaCard } from './idea-card';

interface IdeaChange {
  id: string;
  type: 'new' | 'vote_up' | 'vote_down';
  previousScore?: number;
  newScore?: number;
}

interface IdeasGridProps {
  ideas: Idea[];
  onUpvote: (id: string) => Promise<void>;
  onDownvote: (id: string) => Promise<void>;
  getChangeForIdea: (id: string) => IdeaChange | undefined;
  isLoading: boolean;
  searchQuery: string;
  totalCount: number;
}

export function IdeasGrid({
  ideas,
  onUpvote,
  onDownvote,
  getChangeForIdea,
  isLoading,
  searchQuery,
  totalCount,
}: IdeasGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto"
        />
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-12 h-12 text-white/50" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No Ideas Yet</h3>
        <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
          Be the first to share your brilliant idea! Every great innovation starts with a single thought.
        </p>
      </motion.div>
    );
  }

  if (ideas.length === 0 && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-white/50" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
        <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
          No ideas match your search for "{searchQuery}". Try different keywords or browse all ideas.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {ideas.map((idea, index) => (
          <motion.div
            key={idea.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="h-full"
          >
            <IdeaCard
              idea={idea}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              index={index}
              change={getChangeForIdea(idea.id)}
            />
          </motion.div>
        ))}
      </div>

      {ideas.length > 12 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/70 text-sm">
            <span>Showing {ideas.length} ideas</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
