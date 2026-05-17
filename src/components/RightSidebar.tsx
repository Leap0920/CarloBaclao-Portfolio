'use client';

import { motion } from 'framer-motion';
import { FileCode2, Box, Coffee, Database, GitBranch, Code, Monitor, Smartphone, Shield, Palette, Target } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

const skillIcons: Record<string, React.ReactNode> = {
  'JavaScript': <FileCode2 size={14} className="text-yellow-500" />,
  '.NET': <Box size={14} className="text-purple-500" />,
  'Java': <Coffee size={14} className="text-orange-600" />,
  'Python': <FileCode2 size={14} className="text-blue-500" />,
  'SQL': <Database size={14} className="text-emerald-500" />,
  'Git': <GitBranch size={14} className="text-red-500" />,
  'GitHub': <GithubIcon size={14} />,
  'Visual Studio': <Code size={14} className="text-indigo-500" />,
};

export function RightSidebar() {
  const topSkills = ['JavaScript', '.NET', 'Java', 'Python'];
  const bottomSkills = ['SQL', 'Git', 'GitHub', 'Visual Studio'];

  const expertise = [
    { title: 'Full Stack Dev', icon: <Monitor size={16} className="text-blue-500" /> },
    { title: 'Mobile Dev', icon: <Smartphone size={16} className="text-green-500" /> },
    { title: 'Cybersecurity', icon: <Shield size={16} className="text-red-500" /> },
    { title: 'UI/UX Design', icon: <Palette size={16} className="text-purple-500" /> },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: <GithubIcon size={18} />, url: 'https://github.com/Leap0920' },
    { name: 'LinkedIn', icon: <LinkedinIcon size={18} />, url: 'https://www.linkedin.com/in/baclao-carlo-22936435a/' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-64 flex flex-col gap-4"
    >
      {/* Skill Set Section */}
      <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Core Stack</h3>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {topSkills.map((skill, idx) => (
            <motion.span
              key={`top-${idx}`}
              whileHover={{ scale: 1.05 }}
              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
            >
              {skillIcons[skill]}
              {skill}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {bottomSkills.map((skill, idx) => (
            <motion.span
              key={`bottom-${idx}`}
              whileHover={{ scale: 1.05 }}
              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
            >
              {skillIcons[skill]}
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Expertise Section */}
      <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Expertise</h3>
        </div>

        <div className="space-y-1.5">
          {expertise.map((item, idx) => (
            <motion.div
              key={idx}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2.5 border border-transparent"
              whileHover={{ scale: 1.01, x: 2 }}
            >
              {item.icon}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.title}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Links Section */}
      <motion.div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Connect</h3>
        <div className="flex gap-2">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors text-gray-600 dark:text-gray-300"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
