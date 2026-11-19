import { useState, useEffect, useCallback } from 'react';

/**
 * Search box, tab, priority / status filters and sort order of the All Orders table.
 * Everything except the search term is remembered in localStorage (erp_all_*).
 * Moved unchanged from AllOrdersTableView (Task D step 4) and called where these hooks used to be,
 * so React sees the same hooks on every render.
 */
export default function useTableFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('erp_all_activeTab') || 'all');
  const [priorityFilter, setPriorityFilter] = useState(() => localStorage.getItem('erp_all_priorityFilter') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('erp_all_statusFilter') || 'incomplete');
  const [sortKey, setSortKey] = useState(() => localStorage.getItem('erp_all_sortKey') || 'order_number');
  const [sortDir, setSortDir] = useState(() => localStorage.getItem('erp_all_sortDir') || 'asc');

  useEffect(() => {
    localStorage.setItem('erp_all_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('erp_all_priorityFilter', priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_statusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortKey', sortKey);
  }, [sortKey]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortDir', sortDir);
  }, [sortDir]);

  const handleSort = useCallback((key) => {
    setSortKey(prevKey => {
      if (prevKey === key) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        return prevKey;
      } else {
        setSortDir('asc');
        return key;
      }
    });
  }, []);

  return {
    searchTerm, setSearchTerm, activeTab, setActiveTab, priorityFilter, setPriorityFilter,
    statusFilter, setStatusFilter, sortKey, sortDir, handleSort,
  };
}
