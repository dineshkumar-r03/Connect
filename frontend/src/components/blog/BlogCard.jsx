import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Eye, Clock } from 'lucide-react';
import { formatDate, calculateReadingTime } from '../../utils/helpers';

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card-glass shimmer-overlay tilt-card group">
      {/* Cover image with zoom */}
      {blog.coverImage && (
        <div className="aspect-video overflow-hidden relative">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className="p-5 relative z-10">
        {/* Category + reading time */}
        <div className="flex items-center justify-between mb-3">
          <span className="gradient-badge text-xs">
            {blog.category || 'General'}
          </span>
          <div className="flex items-center gap-1 text-xs text-[var(--clr-text-muted)] bg-white/60 dark:bg-white/5 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/40">
            <Clock className="w-3 h-3" />
            <span>{calculateReadingTime(blog.content)}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.id}`}>
          <h2 className="text-lg font-bold mb-2 leading-snug line-clamp-2 text-[var(--clr-text-primary)] group-hover:gradient-text transition-all duration-200">
            {blog.title}
          </h2>
        </Link>

        {/* Subtitle */}
        {blog.subtitle && (
          <p className="text-sm text-[var(--clr-text-secondary)] mb-4 line-clamp-2 leading-relaxed">
            {blog.subtitle}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--clr-border)] to-transparent mb-4" />

        {/* Author + stats */}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${blog.author.id}`} className="flex items-center gap-2.5 group/author">
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 glow-ring flex-shrink-0">
              {blog.author.profilePicture ? (
                <img src={blog.author.profilePicture} alt={blog.author.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">
                  {blog.author.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--clr-text-primary)] group-hover/author:text-indigo-500 transition-colors leading-none">
                {blog.author.name}
              </p>
              <p className="text-xs text-[var(--clr-text-muted)] mt-0.5">
                {formatDate(blog.createdAt)}
              </p>
            </div>
          </Link>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[var(--clr-text-muted)]">
            <button className="hover:text-rose-500 transition-all duration-200 hover:scale-110 flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">{blog.likeCount || 0}</span>
            </button>
            <button className="hover:text-indigo-500 transition-all duration-200 hover:scale-110 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{blog.commentCount || 0}</span>
            </button>
            <button className="hover:text-sky-500 transition-all duration-200 hover:scale-110 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">{blog.viewCount || 0}</span>
            </button>
            <button className="hover:text-violet-500 transition-all duration-200 hover:scale-110">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;