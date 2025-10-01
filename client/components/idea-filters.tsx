'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Calendar, TrendingUp } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'most_voted' | 'least_voted';

interface IdeaFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalIdeas: number;
  filteredCount: number;
}

export function IdeaFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalIdeas,
  filteredCount,
}: IdeaFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest First', icon: Calendar },
    { value: 'oldest' as const, label: 'Oldest First', icon: Calendar },
    { value: 'most_voted' as const, label: 'Most Voted', icon: TrendingUp },
    { value: 'least_voted' as const, label: 'Least Voted', icon: TrendingUp },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-white/70 hidden sm:block">
            {filteredCount === totalIdeas 
              ? `${totalIdeas} ideas` 
              : `${filteredCount} of ${totalIdeas} ideas`
            }
          </div>

          <div className="relative">
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm font-medium">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <Filter className="w-4 h-4" />
            </motion.button>

            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                {sortOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 ${
                        sortBy === option.value ? 'bg-white/10 text-cyan-400' : 'text-white'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-white/70 mt-3 sm:hidden">
        {filteredCount === totalIdeas 
          ? `${totalIdeas} ideas` 
          : `${filteredCount} of ${totalIdeas} ideas`
        }
      </div>

      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 text-sm text-white/70"
        >
          {filteredCount === 0 ? (
            <span>No ideas found for "{searchQuery}"</span>
          ) : (
            <span>
              Found {filteredCount} idea{filteredCount !== 1 ? 's' : ''} matching "{searchQuery}"
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
