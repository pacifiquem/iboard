'use client';

import { motion } from 'framer-motion';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { type Idea } from '@/lib/api';

interface IdeaChange {
  id: string;
  type: 'new' | 'vote_up' | 'vote_down';
  previousScore?: number;
  newScore?: number;
}

interface IdeaCardProps {
  idea: Idea;
  onUpvote: (id: string) => Promise<void>;
  onDownvote: (id: string) => Promise<void>;
  index: number;
  change?: IdeaChange;
}

export function IdeaCard({ idea, onUpvote, onDownvote, index, change }: IdeaCardProps) {
  const handleUpvote = async () => {
    await onUpvote(idea.id);
  };

  const handleDownvote = async () => {
    await onDownvote(idea.id);
  };

  const netScore = (idea.upvotes || 0) - (idea.downvotes || 0);

  // Animation variants for different change types
  const getCardVariants = () => {
    if (change?.type === 'new') {
      return {
        initial: { opacity: 0, scale: 0.8, y: -20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { 
          duration: 0.6, 
          delay: index * 0.05,
          type: "spring" as const,
          stiffness: 200
        }
      };
    }
    
    return {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, delay: index * 0.05 }
    };
  };

  const getScoreVariants = () => {
    if (change?.type === 'vote_up') {
      return {
        animate: {
          scale: [1, 1.3, 1],
          color: ['#ffffff', '#10b981', '#ffffff'],
          transition: { duration: 0.6 }
        }
      };
    }
    
    if (change?.type === 'vote_down') {
      return {
        animate: {
          scale: [1, 1.3, 1],
          color: ['#ffffff', '#ef4444', '#ffffff'],
          transition: { duration: 0.6 }
        }
      };
    }
    
    return {};
  };

  const cardVariants = getCardVariants();
  const scoreVariants = getScoreVariants();

  return (
    <motion.div
      {...cardVariants}
      className={`group relative ${change?.type === 'new' ? 'ring-2 ring-cyan-400/50' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 h-full flex flex-col">
        <p className="text-white text-base leading-relaxed mb-4 flex-1 break-words overflow-hidden">
          {idea.text}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/50">
            {new Date(idea.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1">
            <motion.button
              onClick={handleUpvote}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowBigUp className="w-4 h-4 text-white/70 hover:text-white" />
            </motion.button>
            
            <motion.span 
              className="text-white font-semibold text-sm px-2 min-w-[2rem] text-center"
              {...scoreVariants}
            >
              {netScore}
            </motion.span>
            
            <motion.button
              onClick={handleDownvote}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowBigDown className="w-4 h-4 text-white/70 hover:text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
