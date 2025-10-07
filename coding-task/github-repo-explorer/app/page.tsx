// import { searchRepositories } from '@/lib/github';
import { RepositoryCard } from '@/components/RepositoryCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { Github } from 'lucide-react';
import { searchRepositories } from '@/lib/github';
// import { Pagination } from '@/components/Pagination';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export default async function Home({ searchParams }: PageProps) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 30;

  const searchQuery = query
    ? `${query} stars:>5000`
    : 'stars:>5000';

  const data = await searchRepositories(searchQuery, page, perPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              GitHub Repository Explorer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Discover popular repositories with 5000+ stars
          </p>
          <SearchBar />
        </header>

        <main>
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Found {data.total_count.toLocaleString()} repositories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalCount={data.total_count}
            perPage={perPage}
          />
        </main>
      </div>
    </div>
  );
}
