import React, { useState } from 'react';
import { 
  Save, 
  PlusCircle, 
  Trash2, 
  Heart, 
  Share, 
  Edit, 
  Clock, 
  CheckCircle,
  Loader,
  UserPlus,
  UserCheck,
  MessageSquare,
  Bookmark,
  Download,
  ExternalLink,
  Calendar,
  User,
  Eye,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const DesignPrinciplesPreview = () => {
  const [theme, setTheme] = useState('light');
  const [animationPlaying, setAnimationPlaying] = useState({
    stagger: false
  });
  
  // Sample blog data
  const blogs = [
    {
      id: 1,
      title: "10 UI Design Principles Every Designer Should Know",
      excerpt: "Effective UI design is about creating interfaces that are intuitive, accessible, and delightful to use.",
      category: "Design",
      tags: ["UI/UX", "Design Principles", "Web Design"],
      authorName: "Alex Johnson",
      authorRole: "Senior Designer",
      date: "April 5, 2025",
      readTime: "8 min read",
      image: "/api/placeholder/800/600",
      views: 1245,
      likes: 89,
      comments: 24
    },
    {
      id: 2,
      title: "The Complete Guide to React Hooks in 2025",
      excerpt: "Learn how to use React Hooks effectively and build more maintainable React applications.",
      category: "Development",
      tags: ["React", "JavaScript", "Web Development"],
      authorName: "Sarah Kim",
      authorRole: "Lead Developer",
      date: "April 2, 2025",
      readTime: "12 min read",
      image: "/api/placeholder/800/600",
      views: 2853,
      likes: 146,
      comments: 37
    },
    {
      id: 3,
      title: "Creating Accessible Web Applications",
      excerpt: "Accessibility is not just a feature, it's a necessity. Learn how to make your web apps accessible to everyone.",
      category: "Accessibility",
      tags: ["A11y", "Inclusive Design", "Web Standards"],
      authorName: "Marcus Chen",
      authorRole: "Accessibility Specialist",
      date: "March 29, 2025",
      readTime: "10 min read",
      image: "/api/placeholder/800/600",
      views: 1568,
      likes: 112,
      comments: 19
    },
    {
      id: 4,
      title: "The Future of Web Animation: Trends to Watch",
      excerpt: "Discover the latest animation techniques that are revolutionizing user experiences on the web.",
      category: "Design",
      tags: ["Animation", "Motion Design", "UX"],
      authorName: "Priya Sharma",
      authorRole: "UX Engineer",
      date: "March 24, 2025",
      readTime: "7 min read",
      image: "/api/placeholder/800/600",
      views: 1987,
      likes: 134,
      comments: 28
    },
    {
      id: 5,
      title: "Building Performant Web Applications with Next.js",
      excerpt: "Learn how to leverage Next.js features to create blazing fast web experiences.",
      category: "Performance",
      tags: ["Next.js", "React", "Performance Optimization"],
      authorName: "David Wilson",
      authorRole: "Full Stack Developer",
      date: "March 20, 2025",
      readTime: "11 min read",
      image: "/api/placeholder/800/600",
      views: 3421,
      likes: 178,
      comments: 42
    }
  ];
  
  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Design': 'indigo',
      'Development': 'purple',
      'Accessibility': 'green',
      'Performance': 'amber'
    };
    
    return colors[category] || 'gray';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gradient-to-br from-gray-950 via-black to-gray-950 text-gray-100' : ''} 
    ${theme === 'light' ? 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={toggleTheme} 
            className={`w-20 h-10 rounded-full overflow-hidden relative transition-colors duration-500 ${ 
              theme === 'dark' ? 'bg-gray-800' : 'bg-blue-300' 
            }`}
          >
            <div className={`absolute transform transition-all duration-500 ${ 
              theme === 'dark' ? 'translate-x-12 -translate-y-8' : 'translate-x-2 translate-y-1' 
            }`}>
              <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
            </div>
            <div className={`absolute transform transition-all duration-500 ${ 
              theme === 'dark' ? 'translate-x-4 translate-y-1 opacity-100' : 'translate-x-16 translate-y-1 opacity-0' 
            }`}>
              <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            </div>
            <div className={`absolute top-2 left-2 transition-opacity duration-500 ${ 
              theme === 'dark' ? 'opacity-100' : 'opacity-0' 
            }`}>
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
            <div className={`absolute top-6 left-12 transition-opacity duration-500 ${ 
              theme === 'dark' ? 'opacity-100' : 'opacity-0' 
            }`}>
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
          </button>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Content Stagger Animation */}
          <div className="p-6">
            <h3 className="font-semibold mb-4 text-xl dark:text-gray-100">Content Stagger Animation</h3>
            <div className="relative h-80 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-lg bg-white/20 border border-white/30">
              <div className={`absolute inset-0 ${
                theme === 'dark' ? 'bg-black' : 'bg-white'
              } flex flex-col justify-center p-8 transition-all duration-500 ${
                animationPlaying['stagger'] ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="max-w-md space-y-4">
                  <h2 className={`text-3xl font-bold text-gray-900 dark:text-white transition-all duration-500 transform ${
                    animationPlaying['stagger'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '0ms' }}>
                    Staggered Animation
                  </h2>
                  
                  <p className={`text-gray-600 dark:text-white transition-all duration-500 transform ${
                    animationPlaying['stagger'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '100ms' }}>
                    Elements appear one after another for a professional effect.
                  </p>
                  
                  <div className={`flex items-center space-x-3 transition-all duration-500 transform ${
                    animationPlaying['stagger'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '200ms' }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-medium dark:text-gray-100">John Doe</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">April 7, 2025</div>
                    </div>
                  </div>
                  
                  <button className={`px-5 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg transition-all duration-500 transform ${
                    animationPlaying['stagger'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '300ms' }}>
                    Read More
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setAnimationPlaying(prev => ({ ...prev, 'stagger': !prev['stagger'] }))
                }}
                className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-indigo-700 hover:bg-indigo-800 text-gray-100' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                } transition-colors flex items-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Toggle Animation
              </button>
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="p-6">
            <div className={`rounded-xl overflow-hidden shadow-lg backdrop-blur-lg ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            } border border-white/30 p-6`}>
              <h4 className="font-bold text-lg mb-4 dark:text-gray-100">Tag Navigation</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Design', color: 'blue' },
                  { name: 'Development', color: 'purple' },
                  { name: 'Productivity', color: 'green' },
                  { name: 'Marketing', color: 'amber' },
                  { name: 'SEO', color: 'red' },
                  { name: 'UI/UX', color: 'cyan' },
                  { name: 'Branding', color: 'pink' },
                  { name: 'Typography', color: 'indigo' }
                ].map((tag) => (
                  <span 
                    key={tag.name} 
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark'
                        ? `bg-${tag.color}-900/40 text-${tag.color}-300 border border-${tag.color}-700/30`
                        : `bg-${tag.color}-100 text-${tag.color}-700 border border-${tag.color}-200`
                    }`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Alert Messages Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-8 px-4 py-2 border-l-4 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent dark:text-gray-100">
            Alert Messages
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Alert */}
            <div className={`flex p-4 rounded-lg border-l-4 border-indigo-500 backdrop-blur-lg ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            } border border-white/30`}>
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-300 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h4 className="text-indigo-600 dark:text-indigo-200 font-medium mb-1">Information Notice</h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 opacity-90">
                  This alert provides important information about your blog post that readers should know.
                </p>
              </div>
            </div>
            
            {/* Success Alert */}
            <div className={`flex p-4 rounded-lg border-l-4 border-green-500 backdrop-blur-lg ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            } border border-white/30`}>
              <svg className="w-5 h-5 text-green-600 dark:text-green-300 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h4 className="text-green-600 dark:text-green-200 font-medium mb-1">Success Message</h4>
                <p className="text-sm text-green-700 dark:text-green-300 opacity-90">
                  Your comment has been submitted successfully. It will appear once approved.
                </p>
              </div>
            </div>
            
            {/* Warning Alert */}
            <div className={`flex p-4 rounded-lg border-l-4 border-amber-500 backdrop-blur-lg ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            } border border-white/30`}>
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-300 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h4 className="text-amber-600 dark:text-amber-200 font-medium mb-1">Warning Notice</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 opacity-90">
                  Your session will expire in 5 minutes. Please save any unsaved changes.
                </p>
              </div>
            </div>
            
            {/* Error Alert */}
            <div className={`flex p-4 rounded-lg border-l-4 border-red-500 backdrop-blur-lg ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            } border border-white/30`}>
              <svg className="w-5 h-5 text-red-600 dark:text-red-300 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <div>
                <h4 className="text-red-600 dark:text-red-200 font-medium mb-1">Error Message</h4>
                <p className="text-sm text-red-700 dark:text-red-300 opacity-90">
                  There was an error processing your request. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Buttons Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-8 px-4 py-2 border-l-4 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent dark:text-gray-100">
            Combined Buttons
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Social Action Buttons */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
              <h2 className="text-xl font-semibold mb-4">Social Action Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className={`flex items-center px-4 py-2 rounded-full font-medium ${
                  theme === 'dark' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                } transition-colors shadow-md`}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </button>
                
                <button className={`flex items-center px-4 py-2 rounded-full font-medium ${
                  theme === 'dark' 
                    ? 'border border-gray-600 hover:bg-gray-700 text-gray-300' 
                    : 'border border-gray-300 hover:bg-gray-100 text-gray-800'
                } transition-colors`}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Following
                </button>
                
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-colors`}>
                  <Heart className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'fill-white' : 'fill-white'}`} />
                  Like
                </button>
              </div>
            </div>

            {/* Content Action Buttons */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
              <h2 className="text-xl font-semibold mb-4">Content Action Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                } transition-colors`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </button>
                
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium bg-opacity-20 ${
                  theme === 'dark' 
                    ? 'bg-green-500 text-green-300 hover:bg-opacity-30' 
                    : 'bg-green-500 text-green-700 hover:bg-opacity-30'
                } transition-colors`}>
                  <Download className="h-4 w-4 mr-2" />
                  Save as Draft
                </button>
                
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-colors`}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>

            {/* Icon Only Buttons */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
              <h2 className="text-xl font-semibold mb-4">Icon Only Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition-colors`}>
                  <Save className="h-5 w-5" />
                </button>
                
                <button className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                } transition-colors`}>
                  <PlusCircle className="h-5 w-5" />
                </button>
                
                <button className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-colors`}>
                  <Trash2 className="h-5 w-5" />
                </button>
                
                <button className={`p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'border border-gray-500 hover:bg-gray-700 text-gray-300' 
                    : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                } transition-colors`}>
                  <Share className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* State Buttons */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
              <h2 className="text-xl font-semibold mb-4">State Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-500 text-white'
                } transition-colors`}>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </button>
                
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark' 
                    ? 'border border-indigo-500 text-indigo-400' 
                    : 'border border-indigo-500 text-indigo-600'
                } transition-colors`}>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Processing
                </button>
                
                <button className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-500 text-white'
                } transition-colors`}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <button className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${
                  theme === 'dark'
                    ? 'from-purple-500 to-pink-500'
                    : 'from-purple-600 to-indigo-500'
                } p-0.5 font-medium text-gray-900 hover:text-white focus:outline-none`}>
                  <span className={`relative rounded-md px-5 py-2 transition-all duration-75 ${
                    theme === 'dark'
                      ? 'bg-black text-white group-hover:bg-opacity-0'
                      : 'bg-white text-gray-900 group-hover:bg-opacity-0'
                  }`}>
                    <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                    Gradient Outline
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple List Blog Cards */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-8 px-4 py-2 border-l-4 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent dark:text-gray-100">
            Simple List Blog Cards
          </h3>
          
          <div className={`rounded-xl overflow-hidden shadow-lg ${
            theme === 'dark' ? 'bg-black border-2 border-gray-700 shadow-indigo-500/20' : 'bg-gray-50 border-2 border-indigo-200'
          }`}>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">Recent Articles</h3>
              
              <div className="space-y-6">
                {blogs.slice(0, 4).map(blog => (
                  <div key={blog.id} className="flex space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-xs mb-1 ${
                        theme === 'dark' 
                          ? `text-${getCategoryColor(blog.category)}-400` 
                          : `text-${getCategoryColor(blog.category)}-600`
                      }`}>
                        {blog.category}
                      </span>
                      
                      <h4 className="font-medium mb-1 line-clamp-2 hover:text-indigo-500 transition-colors">
                        {blog.title}
                      </h4>
                      
                      <div className="flex items-center mt-auto space-x-2">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {blog.date}
                        </span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {blog.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <button className={`inline-flex items-center space-x-1 font-medium ${
                  theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                } transition-colors`}>
                  <span>View All Articles</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Improved Vertical Blog Cards Grid */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-8 px-4 py-2 border-l-4 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent dark:text-gray-100">
            Improved Blog Cards Grid
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map(blog => (
              <div key={blog.id} className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-black border-2 border-gray-400/80 shadow-gray-300/20' : 'bg-gray-50 border-2 border-indigo-200'
              } hover:shadow-xl transition-all duration-300`}>
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`py-1 px-3 rounded-full text-xs font-medium bg-${getCategoryColor(blog.category)}-500 text-white shadow-md`}>
                      {blog.category}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${
                    theme === 'dark' ? 'from-black' : 'from-black/70'
                  } to-transparent`}></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{blog.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{blog.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 hover:text-indigo-500 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className={`mb-5 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 2).map(tag => (
                      <span key={tag} className={`px-2 py-1 rounded-full text-xs ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 border border-gray-700'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 border border-gray-700'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        +{blog.tags.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {blog.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{blog.authorName}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-indigo-500" />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{blog.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{blog.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPrinciplesPreview;