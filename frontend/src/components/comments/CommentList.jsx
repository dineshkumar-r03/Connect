import React, { useState } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { MessageCircle } from 'lucide-react';

const CommentList = ({ comments, blogId, onCommentAdded, onCommentDeleted }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={() => setReplyingTo(comment.id)}
          onCommentDeleted={onCommentDeleted}
        />
      ))}
      
      {replyingTo && (
        <div className="ml-12 mt-4">
          <CommentForm
            blogId={blogId}
            parentId={replyingTo}
            onCommentAdded={(newComment) => {
              onCommentAdded(newComment);
              setReplyingTo(null);
            }}
            onCancel={() => setReplyingTo(null)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentList;