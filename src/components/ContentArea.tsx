'use client';

import { ContentAreaProps } from '@/types/components';

export function ContentArea({ section, content }: ContentAreaProps) {
  return (
    <main 
      className="flex-1 overflow-y-auto"
      role="main"
      aria-label={`${section} content`}
    >
      <div className="space-y-6">
        {/* Hero Card - Only show on home page */}
        {section === 'home' && (
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-white rounded-full"></div>
                <span className="text-sm opacity-90">Sun, 2026 March 29</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Got a project in mind? Let's chat!</h1>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
              <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Stats Cards - Only show on home page */}
        {section === 'home' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M3 3v5h5"/>
                <path d="M21 21v-5h-5"/>
                <path d="M21 3v5h-5"/>
                <path d="M3 21v-5h5"/>
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Career Stats</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
                <div className="text-sm text-gray-600">years</div>
                <div className="text-xs text-gray-500 mt-1">Experience</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-sm text-gray-600">Certificates</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">10+</div>
                <div className="text-sm text-gray-600">Technologies</div>
              </div>
            </div>
          </div>
        )}

        {/* Skill Set Card - Only show on home page */}
        {section === 'home' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"/>
                <path d="M3 12v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"/>
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Skill Set</h2>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xs">HTML</span>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-xs">JS</span>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">TS</span>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-bold text-xs">Java</span>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">CSS</span>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">B</span>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xs">Git</span>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <span className="text-cyan-600 font-bold text-xs">React</span>
              </div>
            </div>
          </div>
        )}

        {/* Expertise Card - Only show on home page */}
        {section === 'home' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Expertise</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" x2="22" y1="12" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Web Development</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <rect width="9" height="9" x="9" y="9" rx="1" ry="1"/>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Graphic Design</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Get in Touch Card - Only show on home page */}
        {section === 'home' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Get in touch</h2>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">M</span>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Regular Content for other sections */}
        {section !== 'home' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
                {content.title}
              </h1>
              {content.metadata && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {content.metadata.lastUpdated && (
                    <span>
                      Last updated: {content.metadata.lastUpdated.toLocaleDateString()}
                    </span>
                  )}
                  {content.metadata.tags && content.metadata.tags.length > 0 && (
                    <div className="flex gap-2">
                      {content.metadata.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              {content.content}
            </div>
          </div>
        )}

        {/* Featured Projects - Only show on home page */}
        {section === 'home' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Featured</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl h-32 p-4 text-white">
                <div className="text-sm opacity-90 mb-2">React App</div>
                <div className="font-semibold">Task Manager</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl h-32 p-4 text-white">
                <div className="text-sm opacity-90 mb-2">Vue.js</div>
                <div className="font-semibold">E-Commerce</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl h-32 p-4 text-white">
                <div className="text-sm opacity-90 mb-2">Next.js</div>
                <div className="font-semibold">Portfolio</div>
              </div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl h-32 p-4 text-white">
                <div className="text-sm opacity-90 mb-2">Node.js</div>
                <div className="font-semibold">API Server</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}