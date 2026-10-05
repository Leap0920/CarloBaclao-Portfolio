'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, GitFork, Star } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { profile } from '@/data/profile';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Kotlin: '#a97bff',
  Python: '#3572A5',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  'C++': '#f34b7d',
  'C#': '#178600',
  Shell: '#89e051',
  Vue: '#41b883',
  Ruby: '#701516',
  Rust: '#dea584',
  Go: '#00ADD8',
  SQL: '#e38c00',
};

function RepoSkeleton() {
  return (
    <li className="flex items-center gap-4 py-4">
      <div className="h-3.5 w-32 animate-pulse rounded bg-zinc-100" />
      <div className="h-3 flex-1 animate-pulse rounded bg-zinc-100" />
      <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
    </li>
  );
}

export function Activity() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/github/repos', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json() as Promise<{ repos: Repo[] }>;
      })
      .then((data) => setRepos(data.repos ?? []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });

    return () => controller.abort();
  }, []);

  return (
    <Section id="activity">
      <SectionHeading
        index="06"
        eyebrow="Activity"
        title="What I have been pushing"
        description="A live look at my GitHub footprint — contribution history and the repositories I have touched most recently."
      />

      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Contributions this year
          </h3>
          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
            <span>Less</span>
            {['#f1f1f4', '#dfe4ff', '#a3b0fc', '#4f5bd5', '#2f34a0'].map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-5 overflow-x-auto">
          {/* Served as an SVG by our own route so the colours match the theme. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/github/contributions"
            alt="GitHub contribution activity for the past year"
            loading="lazy"
            className="h-auto min-w-[620px] w-full"
          />
        </div>
      </Reveal>

      <div className="mt-14">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Recently updated repositories
            </h3>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              @Leap0920
              <ExternalLink size={13} />
            </a>
          </div>
        </Reveal>

        {failed ? (
          <Reveal>
            <p className="mt-5 text-sm text-zinc-600">
              GitHub&apos;s API did not answer this time — the repositories are still on the{' '}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900"
              >
                profile
              </a>
              .
            </p>
          </Reveal>
        ) : (
          <ul className="mt-2 divide-y divide-zinc-200">
            {repos === null
              ? Array.from({ length: 5 }, (_, index) => <RepoSkeleton key={index} />)
              : repos.map((repo) => (
                  <li key={repo.id}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-4 py-4"
                    >
                      <span className="w-40 shrink-0 truncate text-sm font-medium text-zinc-900">
                        {repo.name}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-zinc-500">
                        {repo.description ?? 'No description yet.'}
                      </span>
                      <span className="hidden shrink-0 items-center gap-3 font-mono text-[10px] text-zinc-400 sm:flex">
                        {repo.language ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#a1a1aa',
                              }}
                            />
                            {repo.language}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} />
                          {repo.stars}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GitFork size={11} />
                          {repo.forks}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
