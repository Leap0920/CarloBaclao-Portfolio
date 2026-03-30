import { SectionContent, NavigationSection, ProjectData, AchievementData } from '@/types';

export const careerStats = [
  { icon: '⏱️', label: 'Experience', value: '3', unit: 'years' },
  { icon: '🎖️', label: 'Certificates', value: '24', unit: '' },
  { icon: '💻', label: 'Projects', value: '16', unit: '' },
  { icon: '⚙️', label: 'Technologies', value: '20', unit: '' }
];

export const skillsData = {
  top: [
    { name: 'JavaScript', image: '/images/languages/js.jpg' },
    { name: 'React', image: '/images/languages/react.jpg' },
    { name: 'HTML', image: '/images/languages/html.jpg' },
    { name: 'Tailwind', image: '/images/languages/tailwind.jpg' }
  ],
  bottom: [
    { name: 'PostgreSQL', image: '/images/languages/postgre.jpg' },
    { name: 'MongoDB', image: '/images/languages/mongo.jpg' },
    { name: 'Git', image: '/images/languages/git.jpg' },
    { name: 'GitHub', image: '/images/languages/githuv.jpg' }
  ]
};

export const expertiseData = [
  { title: 'Web Development', icon: '🌐' },
  { title: 'Graphic Design', icon: '🎨' },
  { title: 'Digital Marketing', icon: '📱' },
  { title: 'UI / UX Design', icon: '🎯' }
];

export const socialLinks = [
  { name: 'Facebook', icon: 'f' },
  { name: 'GitHub', icon: 'gh' },
  { name: 'LinkedIn', icon: 'in' },
  { name: 'Medium', icon: 'M' },
  { name: 'WhatsApp', icon: 'wa' }
];

// Certificates data
const certificatesData = [
  'Dart & Flutter | The Complete Flutter Development Course',
  'Introduction to Databases and SQL Querying',
  'Java Database Connection: JDBC and MySQL',
  'Java Programming Basics',
  'PyScript Fundamentals 101 - Run Python in your Browser\'s HTML',
  'Python Programming: The Complete Course for Success',
  'Java Training Crash Course for Java Beginners',
  'C++ And Java Training Crash Course for Beginners',
  'MongoDB - The Complete MongoDB Developers Course',
  'Python Complete Course: with 30+ Hands-on Tasks and Solution',
  'Hands-On Introduction to JavaScript for the Web',
  'JavaScript Fundamentals to Advanced: Full Stack Development',
  'Python from Beginner to Intermediate in 30 min.',
  'Build 13 Projects with PHP MySQL Bootstrap and PDO',
  'Professional Diploma in Agile Product Management',
  'Social Media Graphics Design and Video Editing in Canva',
  'Build A Chat Application With Firebase, Flutter and Provider',
  'Web3 / Blockchain Project Manager Certification Course',
  'Mastering C++ Language - C++ Programming For Beginners',
  'GIT, GitLab, GitHub Fundamentals for Software Developers',
  'Professional Certificate in Project Management',
  'Introduction to Software Engineering',
  'Cisco Introduction to Cybersecurity',
  'FreeCodeCamp Responsive Web Design',
];

// Certificate icon colors for visual variety
const certIconStyles = [
  { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', letter: 'DF' },
  { bg: 'bg-gradient-to-br from-orange-400 to-orange-500', letter: 'DB' },
  { bg: 'bg-gradient-to-br from-red-500 to-red-600', letter: 'JV' },
  { bg: 'bg-gradient-to-br from-red-400 to-red-500', letter: 'JV' },
  { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500', letter: 'Py' },
  { bg: 'bg-gradient-to-br from-green-500 to-green-600', letter: 'Py' },
  { bg: 'bg-gradient-to-br from-red-500 to-red-600', letter: 'JV' },
  { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', letter: 'C+' },
  { bg: 'bg-gradient-to-br from-green-600 to-green-700', letter: 'MG' },
  { bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600', letter: 'Py' },
  { bg: 'bg-gradient-to-br from-yellow-400 to-amber-500', letter: 'JS' },
  { bg: 'bg-gradient-to-br from-amber-400 to-amber-500', letter: 'JS' },
  { bg: 'bg-gradient-to-br from-blue-400 to-blue-500', letter: 'Py' },
  { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', letter: 'PH' },
  { bg: 'bg-gradient-to-br from-teal-500 to-teal-600', letter: 'PM' },
  { bg: 'bg-gradient-to-br from-pink-400 to-pink-500', letter: 'Ca' },
  { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', letter: 'Fl' },
  { bg: 'bg-gradient-to-br from-violet-500 to-violet-600', letter: 'W3' },
  { bg: 'bg-gradient-to-br from-blue-600 to-blue-700', letter: 'C+' },
  { bg: 'bg-gradient-to-br from-gray-700 to-gray-800', letter: 'Gt' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', letter: 'PM' },
  { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', letter: 'SE' },
  { bg: 'bg-gradient-to-br from-sky-600 to-sky-700', letter: 'Ci' },
  { bg: 'bg-gradient-to-br from-green-400 to-green-500', letter: 'FC' },
];

export const sectionContent: Record<NavigationSection, SectionContent> = {
  home: {
    title: 'Dashboard',
    content: (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to my Portfolio</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore my work, skills, and experience through the interactive dashboard above.
          Each section provides detailed insights into my journey as a Full Stack Developer.
        </p>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['dashboard', 'overview']
    }
  },

  about: {
    title: 'About Me',
    content: (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - Wider */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Hero Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="h-44 relative">
              <img
                src="/images/cover.jpg"
                alt="Profile Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="relative px-6 pb-6">
              <div className="flex items-end gap-5 -mt-12">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0 bg-white">
                  <img
                    src="/images/profile.jpg"
                    alt="Carlo Baclao"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-gray-900">Carlo Baclao</h2>
                  <p className="text-blue-600 font-medium text-sm">Full Stack Developer</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* About Bio Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">About</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              Curious and sociable individual with a passion for software engineering. I enjoy learning new technologies
              and applying them to solve real-world problems. My goal is to become a proficient software engineer and
              contribute to innovative projects that make a positive impact.
            </p>
          </div>

          {/* Certificates Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3" /><path d="m8 7 4-4 4 4" /><path d="M20 12.5a8.5 8.5 0 1 1-9-8.472" /><path d="M22 22 2 2" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Certificates</h3>
            </div>

            <div className="space-y-3">
              {certificatesData.slice(0, 6).map((cert, idx) => {
                const style = certIconStyles[idx % certIconStyles.length];
                return (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                      <img
                        src="/images/certification/udemyL.png"
                        alt="Udemy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{cert}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Professional Certificate</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-semibold text-blue-600 hover:underline border-t border-gray-100 pt-4">
              Show all licenses & certifications
            </button>
          </div>
        </div>

        {/* Right Column - Narrower */}
        <div className="space-y-6">
          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Education</h3>
            </div>

            <div className="space-y-6">
              {/* College */}
              <div className="relative group">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">🎓</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">BSc in Information Technology</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Quezon City University</p>
                    <p className="text-xs text-gray-400 mt-1">📅 2023 - Present</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500 leading-relaxed">• Specializing in Software Engineering</p>
                      <p className="text-xs text-gray-500 leading-relaxed">• Full-stack development & architecture</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SHS */}
              <div className="relative group">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-xl flex-shrink-0">🏫</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Information Technology</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Asian Institute of Computer Studies</p>
                    <p className="text-xs text-gray-400 mt-1">📅 2021 - 2023</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">• Foundational programming & networking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Experience</h3>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-xl flex-shrink-0">📊</div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Data Encoder</h4>
                <p className="text-xs text-gray-600 mt-0.5">State Lab Clinics</p>
                <p className="text-xs text-gray-400 mt-1">📅 Apr 2022 - Jul 2022</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">Accurately encoded patient info and managed digital files under strict privacy standards.</p>
              </div>
            </div>
          </div>

          {/* Get in touch Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Get in touch</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Let's build something great together — feel free to connect via social media.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm"
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['personal', 'background', 'education', 'experience', 'certificates']
    }
  },

  certificates: {
    title: 'Certifications',
    content: (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3" /><path d="m8 7 4-4 4 4" /><path d="M20 12.5a8.5 8.5 0 1 1-9-8.472" /><path d="M22 22 2 2" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-none">Professional Certificates</h3>
              <p className="text-sm text-gray-500 mt-1.5">A full collection of my professional credentials and course completions.</p>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest">
                {certificatesData.length} Total
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificatesData.map((cert, idx) => {
              const style = certIconStyles[idx % certIconStyles.length];
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group bg-white shadow-sm overflow-hidden">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                    <img
                      src="/images/certification/udemy.png"
                      alt="Udemy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors uppercase truncate">{cert}</p>
                    <p className="text-[9px] text-emerald-500 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Verified
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['certifications', 'skills']
    }
  },

  projects: {
    title: 'Projects',
    content: (
      <div className="space-y-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          A showcase of some of my recent work, demonstrating various technologies and problem-solving approaches.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">E-Commerce Platform</h3>
              <p className="text-gray-600 text-sm mb-4">
                A full-featured e-commerce solution with real-time inventory management,
                payment processing, and admin dashboard.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">React</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Node.js</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">PostgreSQL</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Stripe</span>
              </div>
              <div className="flex gap-3">
                <a href="#" className="text-blue-600 hover:underline text-sm">Live Demo</a>
                <a href="#" className="text-gray-600 hover:underline text-sm">GitHub</a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Task Management App</h3>
              <p className="text-gray-600 text-sm mb-4">
                A collaborative project management tool with real-time updates,
                team collaboration features, and advanced analytics.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Vue.js</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Express</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">MongoDB</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Socket.io</span>
              </div>
              <div className="flex gap-3">
                <a href="#" className="text-blue-600 hover:underline text-sm">Live Demo</a>
                <a href="#" className="text-gray-600 hover:underline text-sm">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['portfolio', 'development', 'showcase']
    }
  },

};

export const projectsData: ProjectData[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce solution with real-time inventory management, payment processing, and admin dashboard.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/carlobaclao/ecommerce',
    imageUrl: '/projects/ecommerce.jpg',
    featured: true
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative project management tool with real-time updates, team collaboration features, and advanced analytics.',
    technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/carlobaclao/taskmanager',
    imageUrl: '/projects/taskmanager.jpg',
    featured: true
  }
];

export const achievementsData: AchievementData[] = [
  {
    id: '1',
    title: 'Employee of the Year 2023',
    organization: 'Tech Solutions Inc.',
    date: new Date('2023-12-01'),
    description: 'Recognized for outstanding performance and leadership in delivering critical projects.',
    type: 'award'
  },
  {
    id: '2',
    title: 'AWS Certified Developer - Associate',
    organization: 'Amazon Web Services',
    date: new Date('2023-06-01'),
    description: 'Demonstrated expertise in developing and maintaining applications on AWS platform.',
    type: 'certification'
  }
];