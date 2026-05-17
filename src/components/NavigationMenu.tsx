'use client';

import { motion } from 'framer-motion';
import { NavigationMenuProps } from '@/types/components';
import { NavigationSection } from '@/types';
import { Home, User, Code, Briefcase, Calendar, Phone, ChevronRight } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

const navigationItems: { section: NavigationSection; label: string; icon: React.ReactNode }[] = [
  { section: 'home', label: 'Home', icon: <Home size={18} /> },
  { section: 'about', label: 'About', icon: <User size={18} /> },
  { section: 'skills', label: 'Skills', icon: <Code size={18} /> },
  { section: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
  { section: 'projects', label: 'Projects', icon: <Calendar size={18} /> },
  { section: 'github', label: 'GitHub', icon: <GithubIcon size={18} /> },
  { section: 'contact', label: 'Contact', icon: <Phone size={18} /> },
];

export function NavigationMenu({ currentSection, onSectionChange }: NavigationMenuProps) {
  return (
    <nav className="px-4 py-1" role="navigation" aria-label="Main navigation">
      <ul className="space-y-0.5">
        {navigationItems.map(({ section, label, icon }, index) => {
          const isActive = currentSection === section;

          return (
            <motion.li
              key={section}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <motion.button
                onClick={() => onSectionChange(section)}
                className={`w-full flex items-center px-3 py-2 text-sm text-left rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden ${
                  isActive
                    ? 'bg-slate-800 text-white dark:bg-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="mr-3 flex-shrink-0" role="img" aria-hidden="true">
                  {icon}
                </span>
                <span className="font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto text-blue-300"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={12} />
                  </motion.div>
                )}
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}
