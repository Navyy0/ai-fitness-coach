"use client";
import { motion } from "framer-motion";
import PlanCard from "./PlanCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AITips({ tips, motivation }) {
  return (
    <PlanCard title="💡 AI Tips & Motivation">
      {motivation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl transform -rotate-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="relative p-6 bg-gradient-to-br from-white to-white/90 dark:from-gray-800 dark:to-gray-800/90 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
              className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
            >
              ✨
            </motion.div>
            <p className="text-lg font-medium text-gray-800 dark:text-white italic leading-relaxed">
              "{motivation}"
            </p>
          </motion.div>
        </motion.div>
      )}

      {tips && tips.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl transform transition-transform group-hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              />
              <div className="relative p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-primary text-lg">💡</span>
                  </motion.div>
                  <motion.p 
                    className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {tip}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </PlanCard>
  );
}
