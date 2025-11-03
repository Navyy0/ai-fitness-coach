"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check } from "lucide-react";
import { exportPlanToPDF } from "@/lib/pdf";

export default function PDFExportButton({ plan, userData }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    if (!plan) return;
    
    setIsExporting(true);
    try {
      await exportPlanToPDF(plan, userData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExport}
        disabled={isExporting || showSuccess}
        className={`
          px-6 py-3 rounded-xl font-medium flex items-center gap-3 shadow-lg 
          transition-all duration-300 disabled:cursor-not-allowed
          ${showSuccess 
            ? 'bg-green-500 text-white disabled:opacity-100' 
            : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-xl disabled:opacity-50'
          }
        `}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check size={20} />
              <span>Exported!</span>
            </motion.div>
          ) : isExporting ? (
            <motion.div
              key="exporting"
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download size={20} />
              </motion.div>
              <span>Exporting...</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Download size={20} />
              <span>Export PDF</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Success Ring Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute inset-0 bg-green-500/20 rounded-xl -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

