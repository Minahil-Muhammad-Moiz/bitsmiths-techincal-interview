export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

export async function searchRepositories(
  query: string = 'stars:>5000',
  page: number = 1,
  perPage: number = 30
): Promise<GitHubSearchResponse> {
  const url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', query);
  url.searchParams.set('sort', 'stars');
  url.searchParams.set('order', 'desc');
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', perPage.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
