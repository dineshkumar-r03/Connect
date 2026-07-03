import React, { useState, useEffect } from 'react';
import { Bookmark, BookOpen, Sparkles } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import blogService from '../services/blogService';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await blogService.getBookmarks();
      setBookmarks(response.data.content || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading header skeleton */}
        <div className="glass-card p-7 mb-8 animate-pulse">
          <div className="skeleton h-7 w-48 mb-2" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="skeleton h-48 rounded-xl mb-4" />
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

      {/* ─── Animated Page Header ─── */}
      <div className="glass-card p-7 mb-8 relative overflow-hidden animate-slide-up">
        {/* Decorative orbs */}
        <div aria-hidden="true" className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div aria-hidden="true" className="absolute -bottom-10 left-1/3 w-32 h-32 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />

        <div className="flex items-center gap-4 relative z-10">
          {/* Glowing bookmark icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse-glow flex-shrink-0">
            <Bookmark className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="gradient-badge flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Saved
              </span>
            </div>
            <h1 className="text-3xl font-black">
              <span className="gradient-text">My </span>
              <span className="text-[var(--clr-text-primary)]">Bookmarks</span>
            </h1>
            <p className="text-sm text-[var(--clr-text-secondary)] mt-1">
              {bookmarks.length > 0
                ? `${bookmarks.length} article${bookmarks.length !== 1 ? 's' : ''} saved`
                : 'Your saved articles'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Bookmarks grid ─── */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((blog, i) => (
            <div key={blog.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center animate-scale-in max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold gradient-text mb-3">No bookmarks yet</h2>
          <p className="text-sm text-[var(--clr-text-secondary)] leading-relaxed">
            Start saving interesting articles by clicking the{' '}
            <span className="inline-flex items-center gap-1 text-violet-600 font-medium">
              <Bookmark className="w-3.5 h-3.5" /> bookmark
            </span>
            {' '}icon on any blog.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;