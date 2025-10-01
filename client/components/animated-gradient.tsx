'use client';

import { motion } from 'framer-motion';

export function AnimatedGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-[40%] -left-[20%] w-[140%] h-[140%]"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(255, 132, 179, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 20%, rgba(74, 222, 189, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute top-0 right-0 w-full h-full"
        animate={{
          background: [
            'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 60% 60%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
