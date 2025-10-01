import { useEffect, useRef, useState } from 'react';
import { Idea } from '@/lib/api';

interface IdeaChange {
  id: string;
  type: 'new' | 'vote_up' | 'vote_down';
  previousScore?: number;
  newScore?: number;
}

export const useIdeaChanges = (ideas: Idea[]) => {
  const previousIdeasRef = useRef<Idea[]>([]);
  const [changes, setChanges] = useState<IdeaChange[]>([]);

  useEffect(() => {
    const previousIdeas = previousIdeasRef.current;
    const newChanges: IdeaChange[] = [];

    // Check for new ideas
    ideas.forEach(idea => {
      const previousIdea = previousIdeas.find(p => p.id === idea.id);
      
      if (!previousIdea) {
        // New idea
        newChanges.push({
          id: idea.id,
          type: 'new'
        });
      } else {
        // Check for vote changes
        const previousScore = (previousIdea.upvotes || 0) - (previousIdea.downvotes || 0);
        const newScore = (idea.upvotes || 0) - (idea.downvotes || 0);
        
        if (newScore > previousScore) {
          newChanges.push({
            id: idea.id,
            type: 'vote_up',
            previousScore,
            newScore
          });
        } else if (newScore < previousScore) {
          newChanges.push({
            id: idea.id,
            type: 'vote_down',
            previousScore,
            newScore
          });
        }
      }
    });

    if (newChanges.length > 0) {
      setChanges(newChanges);
      
      // Clear changes after animation duration
      setTimeout(() => {
        setChanges([]);
      }, 2000);
    }

    previousIdeasRef.current = [...ideas];
  }, [ideas]);

  const getChangeForIdea = (ideaId: string) => {
    return changes.find(change => change.id === ideaId);
  };

  return { changes, getChangeForIdea };
};
