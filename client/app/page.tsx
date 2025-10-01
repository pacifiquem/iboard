'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Zap, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/glass-card';
import { AnimatedGradient } from '@/components/animated-gradient';

const features = [
  {
    icon: Lightbulb,
    title: 'Share Ideas',
    description: 'Express your thoughts in 280 characters. Simple, focused, and powerful.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get real-time validation from the community. Watch your ideas rise.',
  },
  {
    icon: Users,
    title: 'Discover Trends',
    description: 'See what resonates. Find inspiration. Build on collective creativity.',
  },
];

export default function Home() {
  return (
    <>
      <AnimatedGradient />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            IBoard
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Where brilliant ideas meet collective wisdom. Share, discover, and upvote the next big thing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/app">
              <motion.button
                className="group relative px-8 py-4 text-lg font-semibold rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch Board
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={feature.title} delay={0.8 + index * 0.1}>
                <div className="p-8">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </>
  );
}
