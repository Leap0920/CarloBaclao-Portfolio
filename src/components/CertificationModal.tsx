'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CertificationItem } from '@/types';
import { X, Award, Building2, Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification: CertificationItem | null;
}

export function CertificationModal({ isOpen, onClose, certification }: CertificationModalProps) {
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

  if (!certification) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
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
            className="relative bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden border border-slate-700"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-orange-900/30 text-orange-400 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div className="min-w-0">
                  <h2 id="cert-modal-title" className="text-lg font-semibold text-white truncate">Certification</h2>
                  <p className="text-xs text-gray-400">Credential Details</p>
                </div>
              </div>
              <motion.button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-slate-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                aria-label="Close certification modal"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {certification.imageUrl && (
                <motion.div
                  className="mb-5 rounded-xl overflow-hidden border border-slate-700 bg-slate-700/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                    <Image
                      src={certification.imageUrl}
                      alt={`${certification.name} certificate`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h3 className="text-xl font-bold text-white mb-4 leading-tight">{certification.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 size={16} className="text-gray-500 shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">Issued by</p>
                      <p className="text-white font-medium">{certification.issuer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-gray-500 shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">Issue Date</p>
                      <p className="text-white font-medium">
                        {certification.issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {certification.credentialId && (
                    <div className="flex items-center gap-3 text-sm">
                      <Award size={16} className="text-gray-500 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-xs">Credential ID</p>
                        <p className="text-white font-medium font-mono text-xs">{certification.credentialId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
