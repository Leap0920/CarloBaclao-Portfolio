import { NextResponse } from 'next/server';

export const revalidate = 3600;

const USERNAME = 'Leap0920';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

export interface RepoSummary {
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

/**
 * Returns the most recently pushed, non-fork repositories for the GitHub
 * profile. Fetched server-side so the rate limit applies to this deployment
 * rather than to each visitor, and cached for an hour.
 */
export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'carlobaclao-portfolio',
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Could not load repositories' },
        { status: 502 },
      );
    }

    const data: unknown = await res.json();
    const repos = Array.isArray(data) ? (data as GitHubRepo[]) : [];

    const summaries: RepoSummary[] = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => {
        // Repositories with a description and homepage first, then most recent.
        const scoreA = Number(Boolean(a.description)) + Number(Boolean(a.homepage));
        const scoreB = Number(Boolean(b.description)) + Number(Boolean(b.homepage));
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.pushed_at.localeCompare(a.pushed_at);
      })
      .slice(0, 6)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        pushedAt: repo.pushed_at,
      }));

    return NextResponse.json(
      { repos: summaries },
      { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ error: 'Could not load repositories' }, { status: 502 });
  }
}
