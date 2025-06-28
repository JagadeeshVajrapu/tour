'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function TourPreview({ steps, currentStep }: { steps: any[]; currentStep: number }) {
  if (!steps.length) return null;
  return (
    <div className="relative w-full h-96 flex items-center justify-center mb-6 bg-white rounded-xl shadow-lg p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full flex flex-col items-center justify-center"
        >
          <img src={steps[currentStep].image} alt="" className="max-h-64 rounded shadow mb-4" />
          <div className="text-lg font-semibold text-gray-800 text-center">{steps[currentStep].annotation}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 