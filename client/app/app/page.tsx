'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ideaService, type Idea, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useLivePolling } from '@/hooks/use-live-polling';
import { useIdeaChanges } from '@/hooks/use-idea-changes';
import { IdeaInput } from '@/components/idea-input';
import { IdeaCard } from '@/components/idea-card';
import { AnimatedGradient } from '@/components/animated-gradient';
import { LiveIndicator } from '@/components/live-indicator';

export default function AppPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const { toast } = useToast();

  const loadIdeas = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await ideaService.getAll();
      setIdeas(data);
    } catch (error) {
      console.error('Failed to load ideas:', error);
      if (!silent) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'Failed to load ideas. Please try again.';
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  // Set up live polling after initial load
  useEffect(() => {
    if (!isLoading) {
      setIsPolling(true);
    }
  }, [isLoading]);

  // Live polling hook
  useLivePolling(
    () => loadIdeas(true), // Silent polling
    {
      interval: 3000, // Poll every 3 seconds
      enabled: isPolling,
      pauseOnHidden: true,
    }
  );

  // Detect changes for animations
  const { getChangeForIdea } = useIdeaChanges(ideas);

  const handleSubmit = async (text: string) => {
    try {
      const newIdea = await ideaService.create(text);
      setIdeas([newIdea, ...ideas]);
      
      toast({
        title: "Success!",
        description: "Your idea has been posted successfully.",
      });
    } catch (error) {
      console.error('Failed to create idea:', error);
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to create idea. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      await ideaService.upvote(id);
      setIdeas(ideas.map(idea =>
        idea.id === id ? { 
          ...idea, 
          upvotes: (idea.upvotes || 0) + 1 
        } : idea
      ));
    } catch (error) {
      console.error('Failed to upvote idea:', error);
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to upvote idea. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDownvote = async (id: string) => {
    try {
      await ideaService.downvote(id);
      setIdeas(ideas.map(idea =>
        idea.id === id ? { 
          ...idea, 
          downvotes: (idea.downvotes || 0) + 1 
        } : idea
      ));
    } catch (error) {
      console.error('Failed to downvote idea:', error);
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to downvote idea. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AnimatedGradient />
      <LiveIndicator isLive={isPolling} />
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">IBoard</h1>
            </div>
            <Link href="/">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            </Link>
          </motion.div>

          <div className="mb-12">
            <IdeaInput onSubmit={handleSubmit} />
          </div>

          {isLoading ? (
            <div className="text-center text-white/60 py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  index={index}
                  change={getChangeForIdea(idea.id)}
                />
              ))}
            </div>
          )}

          {!isLoading && ideas.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-white/60 text-xl">No ideas yet. Be the first to share!</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
