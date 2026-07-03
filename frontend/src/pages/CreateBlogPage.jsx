import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../components/blog/BlogForm';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { PenLine, Sparkles, Lightbulb } from 'lucide-react';

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { createBlog } = useBlog();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a blog');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create a blog');
        navigate('/login');
        return;
      }
      const result = await createBlog(data);
      if (result) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      if (error.message === 'Not authenticated' || error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">

      {/* ─── Animated Page Header ─── */}
      <div className="glass-card p-7 mb-8 relative overflow-hidden animate-slide-up">
        <div aria-hidden="true" className="absolute -top-14 -right-14 w-48 h-48 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div aria-hidden="true" className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

        <div className="flex items-start gap-5 relative z-10">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-float flex-shrink-0">
            <PenLine className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="gradient-badge flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Create
              </span>
            </div>
            <h1 className="text-3xl font-black">
              <span className="gradient-text">Share </span>
              <span className="text-[var(--clr-text-primary)]">Your Story</span>
            </h1>
            <p className="text-sm text-[var(--clr-text-secondary)] mt-1.5">
              Inspire the next generation with your experience
            </p>
          </div>

          {/* Tip card */}
          <div className="hidden sm:flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-3.5 py-2.5 text-sm text-amber-700 dark:text-amber-400 font-medium">
            <Lightbulb className="w-4 h-4 flex-shrink-0" />
            <span>Be authentic — real stories inspire!</span>
          </div>
        </div>
      </div>

      {/* ─── Blog Form in glass wrapper ─── */}
      <div className="glass-card p-7 animate-slide-up delay-100">
        <BlogForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateBlogPage;