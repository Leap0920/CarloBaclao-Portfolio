'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { UserProfileProps } from '@/types/components';
import { Download, Mail, Phone, MapPin } from 'lucide-react';

export function UserProfile({ name, title, photoUrl, onResumeClick }: UserProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex flex-col items-center px-4 pt-6 pb-4"
    >
      {/* Profile Image */}
      <motion.div
        className="relative w-16 h-16 mb-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="w-full h-full rounded-full overflow-hidden ring-2 ring-blue-500/30"
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(59, 130, 246, 0.2)',
              '0 0 0 4px rgba(59, 130, 246, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image
            src={photoUrl}
            alt={`${name} profile photo`}
            fill
            sizes="64px"
            className="rounded-full object-cover"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Name and Title */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h1 className="text-base font-semibold text-white mb-0.5">
          {name}
        </h1>
        <p className="text-xs text-gray-400">
          {title}
        </p>
      </motion.div>

      {/* Resume Button */}
      <motion.button
        onClick={onResumeClick}
        className="w-full px-3 py-2 bg-slate-700 text-gray-200 text-xs font-medium rounded-lg hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center justify-center gap-1.5 mb-4"
        aria-label="View resume"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download size={14} />
        Resume
      </motion.button>

      {/* Contact Info */}
      <motion.div
        className="w-full space-y-2 text-xs text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 truncate">
          <Mail size={12} className="shrink-0" />
          <a href="mailto:baclao.carlo.cometa@gmail.com" className="hover:text-blue-400 truncate transition-colors" title="baclao.carlo.cometa@gmail.com">baclao.carlo.cometa@gmail.com</a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} className="shrink-0" />
          <span>09686890263</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate" title="Quezon City, Philippines">Quezon City, PH</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
