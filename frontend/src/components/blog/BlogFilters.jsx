import React from 'react';
import { BLOG_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

const BlogFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      sortBy: 'createdAt',
      direction: 'desc',
      category: '',
      page: 0
    });
  };

  const hasActiveFilters = filters.category || filters.sortBy !== 'createdAt' || filters.direction !== 'desc';

  return (
    <div className="glass-sidebar p-5 space-y-6 animate-slide-up sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[var(--clr-text-primary)] flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </span>
          <span className="gradient-text">Filters</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-rose-400 hover:text-rose-500 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 px-2.5 py-1 rounded-full transition-all duration-200"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent" />

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-[var(--clr-text-muted)] uppercase tracking-widest mb-3">
          Sort By
        </label>
        <div className="space-y-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('sortBy', option.value)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filters.sortBy === option.value
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                  : 'text-[var(--clr-text-secondary)] hover:bg-white/60 dark:hover:bg-white/5 hover:text-[var(--clr-text-primary)] hover:translate-x-1'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent" />

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-[var(--clr-text-muted)] uppercase tracking-widest mb-3">
          Category
        </label>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scroll">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              !filters.category
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'text-[var(--clr-text-secondary)] hover:bg-white/60 dark:hover:bg-white/5 hover:text-[var(--clr-text-primary)] hover:translate-x-1'
            }`}
          >
            ✦ All Categories
          </button>
          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange('category', category)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filters.category === category
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                  : 'text-[var(--clr-text-secondary)] hover:bg-white/60 dark:hover:bg-white/5 hover:text-[var(--clr-text-primary)] hover:translate-x-1'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogFilters;