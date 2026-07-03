import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Send, X } from 'lucide-react';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';

const CommentForm = ({ blogId, parentId, onCommentAdded, onCancel }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Please login to comment on this blog.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const response = await blogService.addComment(blogId, {
        content: content.trim(),
        parentId
      });
      toast.success('Comment added successfully');
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-primary-600 font-semibold text-sm">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentId ? "Write a reply..." : "Write a comment..."}
            className="input resize-none"
            rows={3}
            disabled={loading}
          />
          <div className="flex items-center space-x-2 mt-2">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center space-x-1">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Posting...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <Send className="w-4 h-4" />
                  <span>Post</span>
                </span>
              )}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary text-sm px-4 py-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;