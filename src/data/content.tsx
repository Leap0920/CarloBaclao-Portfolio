import { SectionContent, NavigationSection, ProjectData, AchievementData } from '@/types';

export const careerStats = [
  { icon: '⏱️', label: 'Experience', value: '3', unit: 'years' },
  { icon: '🎖️', label: 'Certificates', value: '20', unit: '' },
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
      <div className="space-y-8">
        <div className="text-lg text-gray-700 leading-relaxed">
          <p className="mb-6">
            I'm a Full Stack Developer based in San Francisco, CA, with a passion for creating 
            digital experiences that combine beautiful design with robust functionality.
          </p>
          <p className="mb-6">
            My journey in software development began during my Computer Science studies at UC Berkeley, 
            where I discovered my love for problem-solving and building things that matter.
          </p>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">My Approach</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">User-Centered Design</h4>
              <p className="text-gray-600 text-sm">Every project starts with understanding user needs and creating intuitive experiences.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Scalable Architecture</h4>
              <p className="text-gray-600 text-sm">Building systems that grow with your business and adapt to changing requirements.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Continuous Learning</h4>
              <p className="text-gray-600 text-sm">Staying current with industry trends and best practices to deliver cutting-edge solutions.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Collaborative Spirit</h4>
              <p className="text-gray-600 text-sm">Working closely with teams to achieve shared goals and mentor fellow developers.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">When I'm Not Coding</h3>
          <p className="text-gray-700 leading-relaxed">
            I enjoy exploring the beautiful Bay Area, trying new restaurants, and staying active through hiking 
            and cycling. I'm also passionate about photography and love capturing the stunning landscapes 
            California has to offer.
          </p>
        </div>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['personal', 'background', 'philosophy']
    }
  },

  achievements: {
    title: 'Achievements',
    content: (
      <div className="space-y-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          Here are some of the milestones and recognitions I've earned throughout my career.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <div className="text-2xl mb-3">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-2">Employee of the Year 2023</h3>
            <p className="text-gray-600 text-sm mb-2">Tech Solutions Inc.</p>
            <p className="text-gray-700 text-sm">Recognized for outstanding performance and leadership in delivering critical projects.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
            <div className="text-2xl mb-3">📜</div>
            <h3 className="font-semibold text-gray-900 mb-2">AWS Certified Developer</h3>
            <p className="text-gray-600 text-sm mb-2">Amazon Web Services</p>
            <p className="text-gray-700 text-sm">Demonstrated expertise in developing and maintaining applications on AWS platform.</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-100">
            <div className="text-2xl mb-3">🎓</div>
            <h3 className="font-semibold text-gray-900 mb-2">Magna Cum Laude</h3>
            <p className="text-gray-600 text-sm mb-2">UC Berkeley</p>
            <p className="text-gray-700 text-sm">Graduated with high honors, maintaining a 3.8 GPA throughout my studies.</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg border border-orange-100">
            <div className="text-2xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Hackathon Winner</h3>
            <p className="text-gray-600 text-sm mb-2">Bay Area Tech Challenge 2022</p>
            <p className="text-gray-700 text-sm">First place for developing an innovative solution to improve accessibility in web applications.</p>
          </div>
        </div>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['awards', 'certifications', 'recognition']
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

  blogs: {
    title: 'Blogs',
    content: (
      <div className="space-y-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          Thoughts, tutorials, and insights from my journey as a Full Stack Developer.
        </p>
        
        <div className="space-y-6">
          <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Building Scalable React Applications</h3>
                <p className="text-sm text-gray-500">December 15, 2024 • 8 min read</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Learn the best practices for structuring React applications that can grow with your team and requirements. 
              From component architecture to state management patterns.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">React</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Architecture</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Best Practices</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Read More →</a>
          </article>

          <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" x2="8" y1="13" y2="13"/>
                  <line x1="16" x2="8" y1="17" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">TypeScript Tips for Better Code Quality</h3>
                <p className="text-sm text-gray-500">November 28, 2024 • 6 min read</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Discover advanced TypeScript techniques that will help you write more maintainable and bug-free code. 
              From utility types to advanced patterns.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">TypeScript</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Code Quality</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Tips</span>
            </div>
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Read More →</a>
          </article>
        </div>
      </div>
    ),
    metadata: {
      lastUpdated: new Date(),
      tags: ['writing', 'tutorials', 'insights']
    }
  }
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