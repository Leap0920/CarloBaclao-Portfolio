'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface SkillSetProps {
  topSkills: Array<{ name: string; image: string }>;
  bottomSkills: Array<{ name: string; image: string }>;
}

interface ExpertiseItem {
  title: string;
  icon: string;
}

interface SocialLink {
  name: string;
  icon: string;
}

interface RightSidebarProps {
  skills: SkillSetProps;
  expertise: ExpertiseItem[];
  socialLinks: SocialLink[];
  showSkills?: boolean;
  showExpertise?: boolean;
}

export function RightSidebar({ skills, expertise, socialLinks, showSkills = true, showExpertise = true }: RightSidebarProps) {
  const [expandedExpertise, setExpandedExpertise] = useState<string | null>(null);
  const [isHoveringTopSkills, setIsHoveringTopSkills] = useState(false);
  const [isHoveringBottomSkills, setIsHoveringBottomSkills] = useState(false);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const topAnimationRef = useRef<number | null>(null);
  const bottomAnimationRef = useRef<number | null>(null);
  const topOffsetRef = useRef(0);
  const bottomOffsetRef = useRef(0);
  const [topSingleWidth, setTopSingleWidth] = useState(0);
  const [bottomSingleWidth, setBottomSingleWidth] = useState(0);

  const toggleExpertise = (title: string) => {
    setExpandedExpertise(expandedExpertise === title ? null : title);
  };

  // Calculate single set width on mount
  useEffect(() => {
    if (topScrollRef.current) {
      const width = topScrollRef.current.scrollWidth / 2;
      setTopSingleWidth(width);
    }
    if (bottomScrollRef.current) {
      const width = bottomScrollRef.current.scrollWidth / 2;
      setBottomSingleWidth(width);
    }
  }, [skills]);

  // Continuous scroll animation without reset
  useEffect(() => {
    if (!showSkills) return;
    const animateTopScroll = () => {
      if (!isHoveringTopSkills && topScrollRef.current && topSingleWidth > 0) {
        topOffsetRef.current += 0.5; // Slide LEFT
        topScrollRef.current.style.transform = `translateX(-${topOffsetRef.current}px)`;
        
        // Seamless loop: reset when reaching exactly one full set
        if (topOffsetRef.current >= topSingleWidth) {
          topOffsetRef.current = 0;
          topScrollRef.current.style.transform = `translateX(0px)`;
        }
      }
      topAnimationRef.current = requestAnimationFrame(animateTopScroll);
    };

    topAnimationRef.current = requestAnimationFrame(animateTopScroll);

    return () => {
      if (topAnimationRef.current) cancelAnimationFrame(topAnimationRef.current);
    };
  }, [isHoveringTopSkills, topSingleWidth, showSkills]);

  useEffect(() => {
    if (!showSkills) return;
    const animateBottomScroll = () => {
      if (!isHoveringBottomSkills && bottomScrollRef.current && bottomSingleWidth > 0) {
        bottomOffsetRef.current += 0.5; // Slide RIGHT
        bottomScrollRef.current.style.transform = `translateX(${bottomOffsetRef.current}px)`;
        
        // Seamless loop: reset when reaching exactly one full set
        if (bottomOffsetRef.current >= bottomSingleWidth) {
          bottomOffsetRef.current = 0;
          bottomScrollRef.current.style.transform = `translateX(0px)`;
        }
      }
      bottomAnimationRef.current = requestAnimationFrame(animateBottomScroll);
    };

    bottomAnimationRef.current = requestAnimationFrame(animateBottomScroll);

    return () => {
      if (bottomAnimationRef.current) cancelAnimationFrame(bottomAnimationRef.current);
    };
  }, [isHoveringBottomSkills, bottomSingleWidth, showSkills]);

  return (
    <div className="w-72 flex flex-col gap-6">
      {/* Skill Set Section */}
      {showSkills && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Set</h3>
          
          {/* Top Row - Scroll Left */}
          <div className="mb-4 overflow-hidden rounded-lg">
            <div
              ref={topScrollRef}
              className="flex gap-3"
              onMouseEnter={() => setIsHoveringTopSkills(true)}
              onMouseLeave={() => setIsHoveringTopSkills(false)}
              style={{ willChange: 'transform' }}
            >
              {[...skills.topSkills, ...skills.topSkills].map((skill, idx) => (
                <div
                  key={`top-${idx}`}
                  className="min-w-fit flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 hover:shadow-md transition-shadow flex items-center justify-center flex-shrink-0">
                    <Image
                      src={skill.image}
                      alt={skill.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Scroll Right */}
          <div className="overflow-hidden rounded-lg">
            <div
              ref={bottomScrollRef}
              className="flex gap-3"
              onMouseEnter={() => setIsHoveringBottomSkills(true)}
              onMouseLeave={() => setIsHoveringBottomSkills(false)}
              style={{ willChange: 'transform' }}
            >
              {[...skills.bottomSkills, ...skills.bottomSkills].map((skill, idx) => (
                <div
                  key={`bottom-${idx}`}
                  className="min-w-fit flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 hover:shadow-md transition-shadow flex items-center justify-center flex-shrink-0">
                    <Image
                      src={skill.image}
                      alt={skill.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expertise Section */}
      {showExpertise && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">👤</span>
            <h3 className="text-lg font-semibold text-gray-900">Expertise</h3>
          </div>

          <div className="space-y-2">
            {expertise.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleExpertise(item.title)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.title}</span>
                </div>
                <span
                  className={`text-gray-400 transition-transform ${
                    expandedExpertise === item.title ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Get in Touch Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💌</span>
          <h3 className="text-lg font-semibold text-gray-900">Get in touch</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Let's build something great together — feel free to connect with me through any of the platforms above.
        </p>

        <div className="flex gap-3 justify-start">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-semibold text-gray-700"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
