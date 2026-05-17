'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Star, GitFork } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export function GitHubSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/Leap0920/repos?sort=updated&per_page=6')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setRepos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Contribution Graph */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-800 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <GithubIcon size={20} />
            Contributions
          </h3>
          <a
            href="https://github.com/Leap0920"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            View Profile
            <ExternalLink size={12} />
          </a>
        </div>
        <div className="w-full overflow-x-auto pb-2">
          <img
            src="https://ghchart.rshah.org/219138/Leap0920"
            alt="Carlo Baclao's GitHub Contributions"
            className="min-w-[700px] w-full"
          />
        </div>
      </motion.div>

      {/* Repositories Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Repositories</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 h-32 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-lg text-sm">
            Failed to load repositories. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-sm group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1.5 truncate">
                    <Globe size={14} />
                    <span className="truncate">{repo.name}</span>
                  </h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 flex-1 line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400 mt-auto">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={12} />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={12} />
                    {repo.forks_count}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
