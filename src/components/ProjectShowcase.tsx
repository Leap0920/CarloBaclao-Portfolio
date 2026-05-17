'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ProjectShowcaseProps {
  name: string;
  subtitle: string;
  description: string;
  techStack: string[];
  image: string;
  url: string;
  accentText: string;
  accentBadge: string;
  accentBadgeBorder: string;
}

export function ProjectShowcase({
  name,
  subtitle,
  description,
  techStack,
  image,
  url,
  accentText,
  accentBadge,
  accentBadgeBorder,
}: ProjectShowcaseProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-sm group cursor-pointer hover:border-slate-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-slate-900">
        <Image
          src={image}
          alt={`${name} cover`}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h4 className={`font-bold text-white text-lg group-hover:${accentText} transition-colors`}>{name}</h4>
            <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
          </div>
          <ExternalLink size={16} className="text-slate-500 shrink-0 mt-1 group-hover:text-white transition-colors" />
        </div>
        <p className="text-sm text-gray-300 mt-2 mb-4">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span key={tech} className={`px-2 py-0.5 ${accentBadge} rounded text-[10px] font-medium border ${accentBadgeBorder}`}>{tech}</span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
