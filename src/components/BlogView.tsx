import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/lodgingData';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  Share2, 
  Sparkles,
  Tag
} from 'lucide-react';

interface BlogViewProps {
  onOpenBooking: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onOpenBooking }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 leading-tight">
                {selectedPost.title}
              </h1>
            </div>

            {selectedPost.coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 shadow-xs">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-slate-700 text-base leading-relaxed pt-2">
              {selectedPost.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Published by <strong>Easy Travel Lodging Editorial Team</strong>
              </span>

              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Book Your 30+ Day Stay
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            Easy Travel Lodging Blog & Guides
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Insights for Traveling Professionals
          </h1>

          <p className="text-slate-600 text-base sm:text-lg">
            Tips for extended mid-term stays, local Sacramento lifestyle guides, and transition housing recommendations.
          </p>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {post.coverImage && (
                  <div className="aspect-16/9 overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-bold">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 group-hover:translate-x-1 transition-all cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
