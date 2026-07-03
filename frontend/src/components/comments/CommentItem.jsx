import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import { Heart, MessageCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, onReply, onCommentDeleted }) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  const isAuthor = user?.id === comment.user?.id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await blogService.deleteComment(comment.id);
        toast.success('Comment deleted successfully');
        onCommentDeleted();
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleLike = async () => {
    // Implementation for liking comments
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
          {comment.user?.profilePicture ? (
            <img src={comment.user.profilePicture} alt={comment.user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-primary-600 font-semibold">
              {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.user?.name || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            {isAuthor && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>

          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm ${
                liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              } hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            {!comment.parent && (
              <button
                onClick={onReply}
                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                {showReplies ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>{comment.replies.length} replies</span>
              </button>

              {showReplies && (
                <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onCommentDeleted={onCommentDeleted}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;