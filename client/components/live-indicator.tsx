'use client';

import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  isLive: boolean;
}

export function LiveIndicator({ isLive }: LiveIndicatorProps) {
  if (!isLive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-full"
    >
      <motion.div
        className="w-2 h-2 bg-green-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="text-green-400 text-xs font-medium">LIVE</span>
    </motion.div>
  );
}
