'use client';

import { motion } from 'framer-motion';
import { SidebarProps } from '@/types/components';
import { UserProfile } from './UserProfile';
import { NavigationMenu } from './NavigationMenu';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar({ currentSection, onSectionChange, onResumeOpen }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-72 bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-sm flex flex-col h-full border border-gray-200 dark:border-slate-700 transition-colors duration-300"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* User Profile Section */}
      <UserProfile
        name="Carlo C. Baclao"
         title="IT Student seeking opportunities"
        onResumeClick={onResumeOpen}
      />

      {/* Navigation Menu */}
      <div className="py-2">
        <NavigationMenu
          currentSection={currentSection}
          onSectionChange={onSectionChange}
        />
      </div>

      {/* Theme Toggle & Footer */}
      <div className="mt-auto p-4 pt-3 border-t border-gray-200 dark:border-slate-700 space-y-2">
        <ThemeToggle />

        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
          Designed & Built by Carlo C. Baclao<br />
          &copy; 2025, All rights reserved.
        </p>
      </div>
    </motion.aside>
  );
}
