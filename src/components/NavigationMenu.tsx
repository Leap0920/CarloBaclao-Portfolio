'use client';

import { NavigationMenuProps } from '@/types/components';
import { NavigationSection } from '@/types';

const navigationItems: { section: NavigationSection; label: string; icon: React.ReactNode }[] = [
  { 
    section: 'home', 
    label: 'Home', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
  },
  { 
    section: 'about', 
    label: 'About', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
  { 
    section: 'certificates', 
    label: 'Certifications', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3"/><path d="m8 7 4-4 4 4"/><path d="M20 12.5a8.5 8.5 0 1 1-9-8.472"/><path d="M22 22 2 2"/></svg>
  },
  { 
    section: 'projects', 
    label: 'Projects', 
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  },
];

export function NavigationMenu({ currentSection, onSectionChange }: NavigationMenuProps) {
  return (
    <nav className="px-4 py-2" role="navigation" aria-label="Main navigation">
      <ul className="space-y-1">
        {navigationItems.map(({ section, label, icon }) => {
          const isActive = currentSection === section;
          
          return (
            <li key={section}>
              <button
                onClick={() => onSectionChange(section)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="mr-3 flex-shrink-0" role="img" aria-hidden="true">
                  {icon}
                </span>
                <span className="font-medium">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}