import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileCard from '../components/profile/ProfileCard';
import {
  User, BookOpen, Heart, Settings, Sparkles,
  Users, Eye, MessageCircle, EyeOff, Trash2, Edit
} from 'lucide-react';
import userService from '../services/userService';
import blogService from '../services/blogService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const userId = id || currentUser?.id;
  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userResponse = await userService.getUser(userId);
      setProfileUser(userResponse.data);
      setFollowersCount(userResponse.data.followersCount || 0);
      setFollowingCount(userResponse.data.followingCount || 0);

      if (currentUser && !isOwnProfile) {
        const followStatus = await userService.checkFollowStatus(userId);
        setIsFollowing(followStatus.data.following);
      }

      const blogsResponse = await blogService.getAllBlogs({ authorId: userId, page: 0, size: 10 });
      setUserBlogs(blogsResponse.data.content || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await userService.followUser(userId);
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      toast.success('Now following this user');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await userService.unfollowUser(userId);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
      toast.success('Unfollowed user');
    } catch (error) {
      toast.error('Failed to unfollow user');
    }
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await blogService.updateBlog(blog.id, {
        title: blog.title,
        subtitle: blog.subtitle,
        content: blog.content,
        category: blog.category,
        tags: blog.tags,
        coverImage: blog.coverImage,
        readingTime: blog.readingTime,
        status: newStatus
      });
      toast.success(newStatus === 'PUBLISHED' ? 'Blog published successfully' : 'Blog hidden successfully');
      fetchProfileData();
    } catch (error) {
      toast.error('Failed to update blog status');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(blogId);
        toast.success('Blog deleted successfully');
        fetchProfileData();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  /* ─── Loading skeleton ─── */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card p-6 animate-pulse">
              <div className="skeleton w-28 h-28 rounded-full mx-auto mb-4" />
              <div className="skeleton h-5 w-1/2 mx-auto mb-2" />
              <div className="skeleton h-4 w-3/4 mx-auto mb-4" />
              <div className="skeleton h-10 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="skeleton h-5 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">User not found</h2>
          <p className="text-[var(--clr-text-secondary)]">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

      {/* ─── Animated Profile Banner ─── */}
      <div className="profile-banner-animated rounded-3xl mb-6 p-8 relative overflow-hidden animate-slide-up">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 relative z-10">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full flex-shrink-0 overflow-hidden glow-ring border-4 border-white/40">
            {profileUser.profilePicture ? (
              <img src={profileUser.profilePicture} alt={profileUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
                <span className="text-3xl font-black text-white">
                  {profileUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <h1 className="text-2xl font-black text-white">{profileUser.name}</h1>
              {isOwnProfile && (
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/30">
                  <Sparkles className="w-3 h-3" />
                  You
                </span>
              )}
            </div>
            {profileUser.bio && (
              <p className="text-white/80 text-sm max-w-md">{profileUser.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            {[
              { value: userBlogs.length, label: 'Blogs' },
              { value: followersCount, label: 'Followers' },
              { value: followingCount, label: 'Following' },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center min-w-[70px] bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-white/25 hover:-translate-y-1"
              >
                <p className="text-2xl font-black text-white leading-none">{s.value}</p>
                <p className="text-white/70 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main content grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sidebar: Profile card + action */}
        <div className="lg:col-span-1 space-y-4 animate-slide-up delay-100">
          <ProfileCard
            user={profileUser}
            isOwnProfile={isOwnProfile}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            isFollowing={isFollowing}
          />

          {isOwnProfile ? (
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-full glass-card p-3.5 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--clr-text-secondary)] hover:text-indigo-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`w-full p-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                isFollowing
                  ? 'glass-card text-[var(--clr-text-secondary)] hover:text-rose-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                {isFollowing ? 'Unfollow' : 'Follow'}
              </div>
            </button>
          )}
        </div>

        {/* Content: Tabs + Blog list */}
        <div className="lg:col-span-2 animate-slide-up delay-200">

          {/* Glass Tab Bar */}
          <div className="glass-tab-bar mb-5">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`glass-tab-item ${activeTab === 'blogs' ? 'glass-tab-active' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Blogs</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'blogs'
                  ? 'bg-white/25 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              }`}>
                {userBlogs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`glass-tab-item ${activeTab === 'likes' ? 'glass-tab-active' : ''}`}
            >
              <Heart className="w-4 h-4" />
              <span>Liked</span>
            </button>
          </div>

          {/* Blogs tab */}
          {activeTab === 'blogs' && (
            <div>
              {userBlogs.length > 0 ? (
                <div className="space-y-4">
                  {userBlogs.map((blog, i) => (
                    <div
                      key={blog.id}
                      className="glass-card p-6 shimmer-overlay animate-slide-up"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="gradient-badge text-xs">
                          {blog.category || 'General'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            blog.status === 'PUBLISHED'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {blog.status}
                          </span>
                          {isOwnProfile && (
                            <div className="flex items-center gap-1.5 ml-2 border-l border-[var(--clr-border)] pl-2">
                              <button
                                onClick={() => handleToggleStatus(blog)}
                                className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 ${
                                  blog.status === 'PUBLISHED'
                                    ? 'text-slate-500 hover:text-amber-500'
                                    : 'text-slate-400 hover:text-emerald-500'
                                }`}
                                title={blog.status === 'PUBLISHED' ? 'Hide Blog' : 'Publish Blog'}
                              >
                                {blog.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => navigate(`/edit/${blog.id}`)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                                title="Edit Blog"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                                title="Delete Blog"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <h3
                        className="text-lg font-bold text-[var(--clr-text-primary)] hover:text-indigo-600 cursor-pointer transition-colors duration-200 mb-1.5"
                        onClick={() => navigate(`/blog/${blog.id}`)}
                      >
                        {blog.title}
                      </h3>
                      {blog.subtitle && (
                        <p className="text-sm text-[var(--clr-text-secondary)] mb-3 line-clamp-2">{blog.subtitle}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-[var(--clr-text-muted)] pt-3 border-t border-[var(--clr-border)]">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.viewCount || 0}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{blog.likeCount || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{blog.commentCount || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-bold gradient-text mb-2">No blogs yet</h3>
                  <p className="text-sm text-[var(--clr-text-secondary)]">
                    {isOwnProfile ? 'Start writing your first blog!' : `${profileUser.name} hasn't written any blogs yet.`}
                  </p>
                  {isOwnProfile && (
                    <button onClick={() => navigate('/create')} className="btn btn-primary mt-5">
                      Write a Blog
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Likes tab */}
          {activeTab === 'likes' && (
            <div className="glass-card p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold gradient-text-pink mb-2">Liked Blogs</h3>
              <p className="text-sm text-[var(--clr-text-secondary)]">
                Blogs that {isOwnProfile ? 'you' : profileUser.name} have liked will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;