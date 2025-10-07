import { Repository } from '@/lib/github';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2">
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
              >
                {repository.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                className="h-5 w-5 rounded-full"
              />
              {repository.owner.login}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-semibold">
              {repository.stargazers_count.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {repository.description || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-2">
          {repository.language && (
            <Badge variant="secondary">{repository.language}</Badge>
          )}
          {repository.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
