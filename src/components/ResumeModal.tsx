'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeModalProps } from '@/types/components';
import { X } from 'lucide-react';

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
            className="relative bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-slate-700"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <motion.h2
                id="resume-modal-title"
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Resume - {resumeContent.personalInfo.name}
              </motion.h2>
              <motion.button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-slate-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
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

            <motion.div
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Email: <span className="text-white">{resumeContent.personalInfo.email}</span></p>
                    <p className="text-gray-400">Phone: <span className="text-white">{resumeContent.personalInfo.phone}</span></p>
                    <p className="text-gray-400">Location: <span className="text-white">{resumeContent.personalInfo.location}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-400">LinkedIn: <a href={resumeContent.personalInfo.linkedin} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Profile</a></p>
                    <p className="text-gray-400">GitHub: <a href={resumeContent.personalInfo.github} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Profile</a></p>
                  </div>
                </div>
              </motion.div>

              <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h3 className="text-lg font-semibold text-white mb-3">Professional Summary</h3>
                <p className="text-gray-300 leading-relaxed">{resumeContent.summary}</p>
              </motion.div>

              <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-lg font-semibold text-white mb-4">Experience</h3>
                <div className="space-y-6">
                  {resumeContent.experience.map((exp, idx) => (
                    <motion.div
                      key={exp.id}
                      className="border-l-2 border-slate-600 pl-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + idx * 0.1 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h4 className="font-semibold text-white">{exp.position}</h4>
                        <span className="text-sm text-gray-400">
                          {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}
                        </span>
                      </div>
                      <p className="text-gray-300 font-medium mb-2">{exp.company}</p>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mb-3">
                        {exp.description.map((desc, index) => (
                          <li key={index}>{desc}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <motion.span key={tech} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded" whileHover={{ scale: 1.05 }}>
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeContent.skills.map((skillCategory, catIdx) => (
                    <motion.div key={skillCategory.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + catIdx * 0.1 }}>
                      <h4 className="font-medium text-white mb-2">{skillCategory.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillCategory.skills.map((skill) => (
                          <motion.span key={skill} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded" whileHover={{ scale: 1.05 }}>
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-lg font-semibold text-white mb-4">Education</h3>
                <div className="space-y-4">
                  {resumeContent.education.map((edu, idx) => (
                    <motion.div
                      key={edu.id}
                      className="border-l-2 border-slate-600 pl-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + idx * 0.1 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <h4 className="font-semibold text-white">{edu.degree} in {edu.field}</h4>
                        <span className="text-sm text-gray-400">
                          {edu.startDate.toLocaleDateString()} - {edu.endDate ? edu.endDate.toLocaleDateString() : 'Present'}
                        </span>
                      </div>
                      <p className="text-gray-300">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-400">GPA: {edu.gpa}</p>}
                      {edu.honors && edu.honors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-400">Honors: {edu.honors.join(', ')}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {resumeContent.certifications.length > 0 && (
                <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeContent.certifications.map((cert, idx) => (
                      <motion.div
                        key={cert.id}
                        className="border border-slate-700 rounded-lg p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 + idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <h4 className="font-semibold text-white mb-1">{cert.name}</h4>
                        <p className="text-gray-300 text-sm mb-2">{cert.issuer}</p>
                        <p className="text-gray-400 text-xs">
                          Issued: {cert.issueDate.toLocaleDateString()}
                          {cert.expiryDate && ` \u2022 Expires: ${cert.expiryDate.toLocaleDateString()}`}
                        </p>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
                            View Credential
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
