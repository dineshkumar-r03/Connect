import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardStats from './DashboardStats';
import { 
  BookOpen, 
  FileText, 
  Heart, 
  Users, 
  Eye, 
  Bookmark,
  TrendingUp,
  Clock
} from 'lucide-react';
import blogService from '../../services/blogService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
    bookmarks: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's blogs
      const response = await blogService.getAllBlogs({ 
        authorId: user?.id,
        page: 0,
        size: 5
      });
      
      const blogs = response.data.content || [];
      setRecentBlogs(blogs);
      
      // Calculate stats
      const published = blogs.filter(b => b.status === 'PUBLISHED');
      const drafts = blogs.filter(b => b.status === 'DRAFT');
      
      setStats({
        totalBlogs: blogs.length,
        publishedBlogs: published.length,
        draftBlogs: drafts.length,
        totalViews: blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0),
        totalLikes: blogs.reduce((sum, b) => sum + (b.likeCount || 0), 0),
        followers: 0,
        following: 0,
        bookmarks: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { label: 'Total Blogs', value: stats.totalBlogs, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Published', value: stats.publishedBlogs, icon: FileText, color: 'text-green-500' },
    { label: 'Drafts', value: stats.draftBlogs, icon: Clock, color: 'text-yellow-500' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-purple-500' },
    { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'text-red-500' },
    { label: 'Followers', value: stats.followers, icon: Users, color: 'text-indigo-500' },
    { label: 'Following', value: stats.following, icon: Users, color: 'text-pink-500' },
    { label: 'Bookmarks', value: stats.bookmarks, icon: Bookmark, color: 'text-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening with your content
        </p>
      </div>

      <DashboardStats stats={statItems} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Blogs */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Blogs</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {blog.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.viewCount || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{blog.likeCount || 0}</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {blog.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No blogs yet. Start writing your first blog!</p>
              <Link to="/create" className="btn-primary inline-block mt-3">
                Create Blog
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/create"
              className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900 dark:text-white">Write New Blog</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Users className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">Edit Profile</span>
            </Link>
            <Link
              to="/bookmarks"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Bookmark className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">View Bookmarks</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;