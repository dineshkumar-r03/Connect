import React, { useState, useEffect } from 'react';
import BlogList from '../components/blog/BlogList';
import BlogFilters from '../components/blog/BlogFilters';
import { useBlog } from '../hooks/useBlog';
import { Sparkles, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    direction: 'desc',
    category: '',
    page: 0,
    size: 10
  });

  const { blogs, loading, totalPages, fetchBlogs } = useBlog();

  useEffect(() => {
    fetchBlogs(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Animated page header */}
      <div className="mb-10 animate-fade-in">
        <div className="glass-card p-7 relative overflow-hidden">
          {/* Decorative gradient blob inside header */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-10 -left-8 w-36 h-36 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="gradient-badge flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Live Feed
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight">
              <span className="gradient-text">Latest</span>{' '}
              <span className="text-[var(--clr-text-primary)]">Stories</span>
            </h1>
            <p className="text-[var(--clr-text-secondary)] mt-1.5 flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Discover fresh experiences from your peers
            </p>
          </div>
        </div>
      </div>

      {/* Layout: sidebar + main */}
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-60 flex-shrink-0 animate-slide-up">
          <BlogFilters filters={filters} onFilterChange={handleFilterChange} />
        </aside>
        <main className="flex-1 animate-slide-up delay-100">
          <BlogList
            blogs={blogs}
            loading={loading}
            totalPages={totalPages}
            currentPage={filters.page}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;