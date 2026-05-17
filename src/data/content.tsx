import React from 'react';
import { motion } from 'framer-motion';
import { SectionContent, NavigationSection, CertificationItem } from '@/types';
import { resumeData } from './resume';
import { GitHubSection } from '@/components/GitHubSection';
import {
  Briefcase, Sparkles, Award, Layers, User, Target, FileText,
  GraduationCap, BookOpen, Code, FolderOpen, MessageSquare,
  CheckCircle, Phone, Mail, ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, TiktokIcon } from '@/components/BrandIcons';

const { personalInfo, summary, experience, education, skills, certifications } = resumeData;

export function getSectionContent(openCertModal: (cert: CertificationItem) => void): Record<NavigationSection, SectionContent> {
  return {
    home: {
      title: "Welcome",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-400 opacity-20 blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Hi, I'm {personalInfo.name} 👋</h2>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
                A 19-year-old IT student and passionate Software Engineer from the Philippines.
                I specialize in full-stack development, continuous learning, and creating
                innovative digital solutions.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const section = document.querySelector('[aria-label="Main navigation"] button:nth-child(5)') as HTMLButtonElement;
                    if (section) section.click();
                  }}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors shadow-sm"
                >
                  View Projects
                </button>
                <button
                  onClick={() => {
                    const section = document.querySelector('[aria-label="Main navigation"] button:nth-child(7)') as HTMLButtonElement;
                    if (section) section.click();
                  }}
                  className="bg-blue-500 bg-opacity-30 border border-blue-400 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-40 transition-colors"
                >
                  Contact Me
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Experience', value: '1+ Yr', icon: <Briefcase size={20} />, color: 'blue' },
              { label: 'Projects', value: '5+', icon: <Sparkles size={20} />, color: 'emerald' },
              { label: 'Certificates', value: '16', icon: <Award size={20} />, color: 'orange' },
              { label: 'Technologies', value: '12+', icon: <Layers size={20} />, color: 'purple' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                  stat.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                  'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  {stat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    about: {
      title: "About Me",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              Profile
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {summary}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {['CURIOUS', 'LEADERSHIP', 'RIGOROUS', 'METICULOUS', 'EMPHATIC', 'SOCIABLE'].map(trait => (
                <span key={trait} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-[10px] font-bold tracking-wider">
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target size={16} className="text-green-500" />
                Goals & Values
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Short-term:</strong> Complete my degree and gain practical experience through internships.</p>
                <p><strong>Long-term:</strong> Become a senior software engineer and lead projects that make a positive impact on society.</p>
                <p><strong>Values:</strong> Integrity, collaboration, continuous learning, respect, working together.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText size={16} className="text-purple-500" />
                Hobbies & Interests
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Hobbies:</strong> Playing video games, watching movies, exploring new places, reading books about Philosophy and Psychology.</p>
                <p><strong>Interests:</strong> Web development, mobile app development, artificial intelligence, cybersecurity, networking.</p>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },
    skills: {
      title: "Skills & Expertise",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.skills.map(skill => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    experience: {
      title: "Experience & Education",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-500" />
              Work Experience
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-600 before:to-transparent">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white dark:border-slate-800 bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircle size={12} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
                      <div className="font-bold text-slate-900 dark:text-white">{exp.position}</div>
                      <time className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {exp.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.endDate ? exp.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </time>
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">{exp.company}</div>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3 ml-2">
                      {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                    </ul>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-medium text-slate-600 dark:text-slate-300">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <GraduationCap size={20} className="text-emerald-500" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree} in {edu.field}</h4>
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">{edu.institution}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {edu.startDate.getFullYear()} - {edu.endDate ? edu.endDate.getFullYear() : 'Present'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    projects: {
      title: "Projects & Certifications",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Code size={20} className="text-indigo-500" />
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="h-32 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  <FolderOpen size={48} className="text-slate-300 dark:text-slate-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Portfolio Website</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 flex-1">A modern, responsive personal portfolio built with Next.js, React, Tailwind CSS, and Framer Motion.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Next.js', 'React', 'Tailwind CSS'].map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="h-32 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  <MessageSquare size={48} className="text-slate-300 dark:text-slate-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Chat Application</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 flex-1">A real-time messaging application built with Flutter, Firebase, and Provider state management.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Flutter', 'Dart', 'Firebase'].map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award size={20} className="text-orange-500" />
              Certifications ({certifications.length} Total)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.map((cert, index) => (
                <motion.button
                  key={cert.id}
                  onClick={() => openCertModal(cert)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="text-left p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">{cert.name}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.issuer}</p>
                    </div>
                    <ExternalLink size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-orange-400 transition-colors shrink-0 mt-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    github: {
      title: "GitHub Activity",
      content: <GitHubSection />
    },
    contact: {
      title: "Get In Touch",
      content: (
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 mb-6 text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Let's Connect</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              I'm currently looking for new opportunities, internships, and exciting projects.
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Mail size={18} />
              Send Me an Email
            </a>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'GitHub', url: personalInfo.github, icon: <GithubIcon size={24} /> },
              { name: 'LinkedIn', url: personalInfo.linkedin, icon: <LinkedinIcon size={24} /> },
              { name: 'TikTok', url: 'https://www.tiktok.com/@galaxyfrog20', icon: <TiktokIcon size={24} /> },
              { name: 'Instagram', url: 'https://www.instagram.com/_nous.c/', icon: <InstagramIcon size={24} /> },
            ].map((social, i) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group shadow-sm"
              >
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {social.icon}
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      )
    }
  };
}
