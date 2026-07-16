import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { ApiError } from '../services/httpClient';
import type { Booking } from '../types/booking';

interface UseBookingsOptions {
  pageSize?: number;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const pageSize = options.pageSize ?? 10;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await bookingService.getBookings({
        pageNumber,
        pageSize,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setBookings(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar las reservas.');
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize, status, from, to]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  function updateFilters(next: { status?: string; from?: string; to?: string }) {
    if (next.status !== undefined) setStatus(next.status);
    if (next.from !== undefined) setFrom(next.from);
    if (next.to !== undefined) setTo(next.to);
    setPageNumber(1);
  }

  return {
    bookings,
    isLoading,
    error,
    refetch,
    pageNumber,
    setPageNumber,
    totalPages,
    totalCount,
    status,
    from,
    to,
    updateFilters,
  };
}
