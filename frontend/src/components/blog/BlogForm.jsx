import React, { useState, useEffect, useRef } from 'react';
import { BLOG_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

// Import ReactQuill and styles
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Import highlight.js for syntax highlighting
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Configure highlight.js on the window object for Quill's syntax module
window.hljs = hljs;

// Register custom hr block embed blot in Quill
const BlockEmbed = Quill.import('blots/block/embed');
class HRBlot extends BlockEmbed {
  static create() {
    return document.createElement('hr');
  }
}
HRBlot.blotName = 'hr';
HRBlot.tagName = 'hr';
Quill.register(HRBlot);

// Assign custom icons to the Quill toolbar map
const icons = Quill.import('ui/icons');
icons['undo'] = `<svg viewBox="0 0 18 18">
  <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
  <path class="ql-stroke" d="M14,15a7,7,0,0,0-7-7H4"></path>
</svg>`;
icons['redo'] = `<svg viewBox="0 0 18 18">
  <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
  <path class="ql-stroke" d="M4,15a7,7,0,0,1,7-7h3"></path>
</svg>`;
icons['hr'] = `<svg viewBox="0 0 18 18">
  <line class="ql-stroke" x1="2" y1="9" x2="16" y2="9" stroke-width="2"></line>
</svg>`;

// Configure Quill Modules and custom handlers
const modules = {
  syntax: true,
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      ['undo', 'redo', 'hr']
    ],
    handlers: {
      undo: function() {
        this.quill.history.undo();
      },
      redo: function() {
        this.quill.history.redo();
      },
      hr: function() {
        const range = this.quill.getSelection();
        if (range) {
          this.quill.insertEmbed(range.index, 'hr', 'user');
          this.quill.setSelection(range.index + 1);
        }
      }
    }
  },
  history: {
    delay: 1000,
    maxStack: 500,
    userOnly: true
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'align',
  'blockquote', 'code-block',
  'list', 'bullet',
  'link', 'image',
  'hr'
];

const BlogForm = ({ initialData, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    coverImage: initialData?.coverImage || '',
    readingTime: initialData?.readingTime || 5,
    status: initialData?.status || 'DRAFT'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (html) => {
    setFormData(prev => ({ ...prev, content: html }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  // Run syntax highlighting inside preview container when preview tab is active
  useEffect(() => {
    if (activeTab === 'preview') {
      const blocks = document.querySelectorAll('.preview-container pre code');
      blocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [activeTab, formData.content]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    // Check clean content size, avoiding default empty markup '<p><br></p>'
    const isContentEmpty = !formData.content.trim() || formData.content === '<p><br></p>';
    if (isContentEmpty) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error(isEditing ? 'Failed to update blog' : 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Blog Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Enter your blog title"
          disabled={loading}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subtitle (Optional)
        </label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="input"
          placeholder="A brief description of your blog"
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content *
          </label>
          <div className="flex space-x-1 bg-gray-150 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-750 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-750 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>

        {activeTab === 'write' ? (
          <div className="animate-fade-in">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Write your story using rich formatting..."
              readOnly={loading}
            />
          </div>
        ) : (
          <div className="animate-fade-in preview-container prose dark:prose-invert max-w-none p-6 border border-dashed border-gray-300 dark:border-slate-700 rounded-2xl bg-white/40 dark:bg-slate-900/10 min-h-[380px] overflow-y-auto">
            {formData.content.trim() && formData.content !== '<p><br></p>' ? (
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            ) : (
              <p className="text-gray-400 dark:text-slate-500 italic text-center py-12">Nothing to preview yet...</p>
            )}
          </div>
        )}
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={loading}
          >
            <option value="">Select a category</option>
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input"
            placeholder="e.g., React, Java, Interview"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com/image.jpg"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            id="readingTime"
            name="readingTime"
            value={formData.readingTime}
            onChange={handleChange}
            className="input"
            min="1"
            max="60"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
          disabled={loading}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Publish</option>
        </select>
      </div>

      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </span>
          ) : (
            <span>{isEditing ? 'Update Blog' : 'Create Blog'}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary px-8 py-3 text-base"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;