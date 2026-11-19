import { useState, useEffect } from 'react';

/**
 * Page size (remembered in localStorage as erp_all_pageSize) and current page of the All Orders
 * table. The page resets to 1 whenever the search, tab, filters or stat-card filter change.
 * Moved unchanged from AllOrdersTableView (Task D step 4) and called where these hooks used to be,
 * so React sees the same hooks on every render.
 */
export default function usePagination({ searchTerm, activeTab, priorityFilter, statusFilter, statCardFilter }) {
  // Pagination state
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('erp_all_pageSize');
    if (saved === 'all') return 'all';
    const num = Number(saved);
    return num && num > 0 ? num : 100;
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem('erp_all_pageSize', String(pageSize));
  }, [pageSize]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, priorityFilter, statusFilter, statCardFilter]);

  return {
    pageSize, setPageSize, currentPage, setCurrentPage,
  };
}
