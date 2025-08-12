'use client';

import React from 'react';

import clsx from 'clsx';
import { Star } from 'lucide-react';

import { Card } from '~/shared/shadcn/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/shared/shadcn/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/shared/shadcn/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/shared/shadcn/table';

const feedbackData = [
  {
    email: 'john.doe@example.com',
    rating: 4,
    description: 'Great experience overall!',
    date: '2025-08-08'
  },
  {
    email: 'jane.smith@example.com',
    rating: 5,
    description: '',
    date: '2025-08-07'
  },
  {
    email: 'rohit.patel@example.com',
    rating: 3,
    description:
      'Could improve in certain areas and this is a fantastic product by the way keep it up! Your rocking go on guys achieve the best you can.',
    date: '2025-08-05'
  },
  {
    email: 'lisa.chen@example.com',
    rating: 2,
    description: 'Not very satisfied.',
    date: '2025-08-03'
  }
];

// Helper to render stars
function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={clsx(
            'size-4',
            i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          )}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const [filter, setFilter] = React.useState('recent');
  const [pageIndex, setPageIndex] = React.useState(0);
  const pageSize = 2; // show 2 feedback entries per page

  // Apply sorting based on filter
  const sortedFeedback = React.useMemo(() => {
    const dataCopy = [...feedbackData];

    if (filter === 'recent') {
      return dataCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (filter === 'high') {
      return dataCopy.sort((a, b) => b.rating - a.rating);
    }
    if (filter === 'low') {
      return dataCopy.sort((a, b) => a.rating - b.rating);
    }

    return dataCopy;
  }, [filter]);

  const pageCount = Math.ceil(sortedFeedback.length / pageSize);
  const paginatedData = sortedFeedback.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-4 lg:px-10">
      <div className="flex items-start justify-between">
        <h1 className="font-medium md:text-2xl">
          <strong>Users</strong> Feedback
        </h1>

        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v);
            setPageIndex(0);
          }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="high">High Rated</SelectItem>
            <SelectItem value="low">Low Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-sm font-semibold md:text-xl">S.No</TableHead>
              <TableHead className="text-sm font-semibold md:text-xl">Email</TableHead>
              <TableHead className="text-sm font-semibold md:text-xl">Rating</TableHead>
              <TableHead className="text-sm font-semibold md:text-xl">Description</TableHead>
              <TableHead className="text-right text-sm font-semibold md:text-xl">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((fb, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center font-medium">
                  {pageIndex * pageSize + idx + 1}
                </TableCell>
                <TableCell className="py-5 font-medium">{fb.email}</TableCell>
                <TableCell>
                  <StarRating value={fb.rating} />
                </TableCell>
                <TableCell className="text-muted-foreground min-w-[250px] text-left text-sm whitespace-normal">
                  {fb.description?.trim() ? fb.description : '—'}
                </TableCell>
                <TableCell className="text-right">{fb.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pageIndex > 0) setPageIndex(pageIndex - 1);
                }}
                className={pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={pageIndex === index}
                  onClick={(e) => {
                    e.preventDefault();
                    setPageIndex(index);
                  }}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pageIndex < pageCount - 1) setPageIndex(pageIndex + 1);
                }}
                className={pageIndex === pageCount - 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>{' '}
      </div>
    </div>
  );
}
