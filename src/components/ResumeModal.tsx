'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeModalProps } from '@/types/components';
import { X, Download } from 'lucide-react';

export function ResumeModal({ isOpen, onClose, resumeContent }: ResumeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            ref={modalRef}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full mx-2 sm:mx-4 h-[88vh] flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 shrink-0">
               <motion.h2
                 id="resume-modal-title"
                 className="text-2xl font-semibold text-gray-900 dark:text-white"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 }}
               >
                 Resume - {resumeContent.personalInfo.name}
               </motion.h2>
               <div className="flex items-center gap-2">
                 <motion.a
                   href="/Carlo_Baclao_Resume.pdf"
                   download="Carlo_Baclao_Resume.pdf"
                   className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                   aria-label="Download resume PDF"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Download size={14} />
                   Download
                 </motion.a>
                 <motion.button
                   ref={closeButtonRef}
                   onClick={onClose}
                   className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                   aria-label="Close resume modal"
                   whileHover={{ scale: 1.1, rotate: 90 }}
                   whileTap={{ scale: 0.9 }}
                   initial={{ opacity: 0, rotate: -90 }}
                   animate={{ opacity: 1, rotate: 0 }}
                   transition={{ delay: 0.2 }}
                 >
                   <X size={24} />
                 </motion.button>
               </div>
             </div>

             <motion.div
               className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 overflow-hidden"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.15 }}
             >
               {/* PDF Preview */}
               <motion.div
                 className="flex-1 w-full h-full border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.18 }}
               >
                 <iframe
                   src="/Carlo_Baclao_Resume.pdf#toolbar=0&navpanes=0&pagemode=none&view=FitH"
                   className="w-full h-full border-0"
                   title="Resume PDF Preview"
                   loading="lazy"
                 />
               </motion.div>
             </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
