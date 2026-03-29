'use client';

import { useEffect, useRef } from 'react';
import { ResumeModalProps } from '@/types/components';

export function ResumeModal({ isOpen, onClose, resumeContent }: ResumeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pl-6"
      style={{ left: '368px' }} // Offset by sidebar width + margins (320px + 48px)
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="resume-modal-title" className="text-2xl font-semibold text-gray-900">
            Resume - {resumeContent.personalInfo.name}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label="Close resume modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Personal Info */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Email: <span className="text-gray-900">{resumeContent.personalInfo.email}</span></p>
                <p className="text-gray-600">Phone: <span className="text-gray-900">{resumeContent.personalInfo.phone}</span></p>
                <p className="text-gray-600">Location: <span className="text-gray-900">{resumeContent.personalInfo.location}</span></p>
              </div>
              <div>
                <p className="text-gray-600">LinkedIn: <a href={resumeContent.personalInfo.linkedin} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Profile</a></p>
                <p className="text-gray-600">GitHub: <a href={resumeContent.personalInfo.github} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Profile</a></p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{resumeContent.summary}</p>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
            <div className="space-y-6">
              {resumeContent.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <span className="text-sm text-gray-600">
                      {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mb-3">
                    {exp.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeContent.skills.map((skillCategory) => (
                <div key={skillCategory.category}>
                  <h4 className="font-medium text-gray-900 mb-2">{skillCategory.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="space-y-4">
              {resumeContent.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                    <span className="text-sm text-gray-600">
                      {edu.startDate.toLocaleDateString()} - {edu.endDate ? edu.endDate.toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Honors: {edu.honors.join(', ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {resumeContent.certifications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeContent.certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                    <p className="text-gray-700 text-sm mb-2">{cert.issuer}</p>
                    <p className="text-gray-600 text-xs">
                      Issued: {cert.issueDate.toLocaleDateString()}
                      {cert.expiryDate && ` • Expires: ${cert.expiryDate.toLocaleDateString()}`}
                    </p>
                    {cert.credentialUrl && (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}