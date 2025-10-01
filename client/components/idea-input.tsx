'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface IdeaInputProps {
  onSubmit: (text: string) => Promise<void>;
}

export function IdeaInput({ onSubmit }: IdeaInputProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remaining = 280 - text.length;
  const isOverLimit = remaining < 0;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-yellow-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your next big idea..."
            className="w-full bg-transparent text-white placeholder-white/40 outline-none resize-none text-lg"
            rows={3}
            maxLength={300}
          />
          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm font-medium ${isOverLimit ? 'text-red-400' : 'text-white/60'}`}>
              {remaining} characters remaining
            </span>
            <motion.button
              type="submit"
              disabled={!text.trim() || isOverLimit || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              whileHover={{ scale: text.trim() && !isOverLimit ? 1.05 : 1 }}
              whileTap={{ scale: text.trim() && !isOverLimit ? 0.95 : 1 }}
            >
              {isSubmitting ? 'Posting...' : 'Post Idea'}
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
