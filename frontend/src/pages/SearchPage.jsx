import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Sparkles } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import { useBlog } from '../hooks/useBlog';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchBlogs, loading } = useBlog();
  const [query, setQuery] = useState(new URLSearchParams(location.search).get('q') || '');
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'relevance'
  });

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters]);

  const performSearch = async () => {
    try {
      const data = await searchBlogs(query, { ...filters, page: 0, size: 20 });
      setResults(data.content || []);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    navigate('/search');
  };

  const categories = [
    'All', 'Placement', 'Internship', 'DSA', 'Development',
    'Resume', 'Open Source', 'Projects', 'Higher Studies',
    'Career Advice', 'Success Stories', 'Hackathons'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

      {/* ─── Search Hero ─── */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden animate-slide-up">
        {/* Decorative blobs */}
        <div aria-hidden="true" className="absolute -top-14 -left-14 w-44 h-44 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div aria-hidden="true" className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2 justify-center">
            <span className="gradient-badge flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Discover
            </span>
          </div>
          <h1 className="text-3xl font-black text-center mb-6">
            <span className="gradient-text">Search</span>{' '}
            <span className="text-[var(--clr-text-primary)]">Stories</span>
          </h1>

          {/* Search input */}
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--clr-text-muted)] w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blogs, topics, authors..."
                className="input-glass pl-12 pr-12 glow-border"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--clr-text-muted)] hover:text-rose-500 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary px-6 py-3.5">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ─── Category filter pills ─── */}
      <div className="flex flex-wrap items-center gap-2 mb-6 animate-slide-up delay-100">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilters({ ...filters, category: category === 'All' ? '' : category })}
            className={`category-pill text-sm transition-all duration-200 hover:-translate-y-0.5 ${
              (filters.category === '' && category === 'All') || filters.category === category
                ? 'pill-active'
                : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ─── Results status ─── */}
      {query && (
        <div className="mb-5 animate-fade-in">
          <p className="text-sm text-[var(--clr-text-secondary)]">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Searching for "{query}"...
              </span>
            ) : (
              <>
                Found{' '}
                <span className="font-bold gradient-text">{results.length}</span>
                {' '}result{results.length !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold text-[var(--clr-text-primary)]">"{query}"</span>
              </>
            )}
          </p>
        </div>
      )}

      {/* ─── Results grid ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="skeleton h-48 rounded-xl mb-4" />
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((blog, i) => (
            <div key={blog.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="glass-card p-16 text-center animate-scale-in max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold gradient-text mb-2">No results found</h2>
          <p className="text-sm text-[var(--clr-text-secondary)]">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div className="glass-card p-16 text-center animate-scale-in max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-5">
            <Search className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold gradient-text mb-2">Explore Stories</h2>
          <p className="text-sm text-[var(--clr-text-secondary)]">
            Enter a keyword, topic, or author name to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;