import { motion } from 'framer-motion';

export default function PlanCard({ title, children, onSave }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3"
      >
        <span className="text-primary">{title}</span>
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative text-gray-600 dark:text-gray-300"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
