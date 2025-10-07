'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  perPage: number;
}

export function Pagination({ currentPage, totalCount, perPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / perPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/?${params.toString()}`;
  };

  const handlePrevious = () => {
    if (hasPrevPage) {
      router.push(createPageUrl(currentPage - 1));
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      router.push(createPageUrl(currentPage + 1));
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        onClick={handlePrevious}
        disabled={!hasPrevPage}
        variant="outline"
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={handleNext}
        disabled={!hasNextPage}
        variant="outline"
        className="gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
