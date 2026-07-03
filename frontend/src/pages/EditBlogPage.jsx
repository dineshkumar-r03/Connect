import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogForm from '../components/blog/BlogForm';
import { useBlog } from '../hooks/useBlog';
import toast from 'react-hot-toast';
import { PenSquare, Sparkles, ArrowLeft } from 'lucide-react';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBlog, updateBlog } = useBlog();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      const data = await fetchBlog(id);
      setBlog(data);
    } catch (error) {
      toast.error('Failed to load blog');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await updateBlog(id, data);
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8 animate-pulse space-y-5">
          <div className="skeleton h-8 w-1/2 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--clr-text-secondary)] hover:text-indigo-600 transition-all duration-200 mb-5 group glass px-4 py-2 rounded-full text-sm font-medium hover:-translate-x-1"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back
      </button>

      {/* ─── Animated Page Header ─── */}
      <div className="glass-card p-7 mb-8 relative overflow-hidden animate-slide-up">
        <div aria-hidden="true" className="absolute -top-14 -right-14 w-48 h-48 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <PenSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="gradient-badge flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Edit
              </span>
            </div>
            <h1 className="text-3xl font-black">
              <span className="gradient-text">Edit </span>
              <span className="text-[var(--clr-text-primary)]">Blog</span>
            </h1>
          </div>
        </div>
      </div>

      {/* ─── Blog Form in glass wrapper ─── */}
      <div className="glass-card p-7 animate-slide-up delay-100">
        <BlogForm initialData={blog} onSubmit={handleSubmit} isEditing />
      </div>
    </div>
  );
};

export default EditBlogPage;