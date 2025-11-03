'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyMotivation() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotivationalQuote = async () => {
      try {
        const response = await fetch('/api/motivation');
        const data = await response.json();
        setQuote(data.quote);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('Stay motivated and keep pushing forward! 💪');
      } finally {
        setLoading(false);
      }
    };

    fetchMotivationalQuote();
  }, []); // Fetch once when component mounts

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-br from-card to-card/90 rounded-xl p-6 shadow-lg mb-6 hover:shadow-xl transition-shadow"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50"
      />
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl font-bold mb-4 text-primary"
      >
        ✨ Daily Motivation
      </motion.h3>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="animate-pulse h-4 bg-muted rounded w-3/4" />
            <div className="animate-pulse h-4 bg-muted rounded w-1/2" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.p 
              className="text-lg italic text-muted-foreground leading-relaxed"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              "{quote}"
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}