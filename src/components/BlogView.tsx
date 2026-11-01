import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost, getFallbackPropertyImage } from '../data/lodgingData';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronLeft
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface BlogViewProps {
  onOpenBooking: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onOpenBooking }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="py-12 sm:py-20 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#00897d] hover:text-[#00b7a8] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <article className="bg-white rounded-3xl p-6 sm:p-12 border border-[#e6dfd5] shadow-2xs space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#6e5f53]">
                <span className="text-[#82634f] font-bold">{selectedPost.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00b7a8]" />
                  {selectedPost.date}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00b7a8]" />
                  {selectedPost.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-heading font-black text-[#282828] leading-tight text-balance">
                {selectedPost.title}
              </h1>
            </div>

            {selectedPost.coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-16/9 bg-[#f4efe9] border border-[#e6dfd5] shadow-2xs">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(2);
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-[#4a3e35] text-base leading-relaxed pt-2">
              {selectedPost.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-8 border-t border-[#efe9e0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#6e5f53]">
                Published by <strong className="text-[#282828]">Easy Travel Lodging Editorial Team</strong>
              </span>

              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                Check Residence Availability
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5]">
      {/* Live Realistic River Sunrise Header */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 text-center text-white border-b border-[#3a2f28]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#4de0d2] text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-[#4de0d2]" />
            <span>Journal &amp; Regional Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight text-balance">
            Local Guides, Relocation Tips &amp; Extended-Stay Insights
          </h1>

          <p className="text-[#ede5dc] text-base sm:text-lg leading-relaxed">
            Practical advice for smooth home transitions, Sacramento and Rancho Cordova neighborhood highlights, and tips for feeling at home away from home.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#e6dfd5] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {post.coverImage && (
                  <div className="aspect-16/9 overflow-hidden bg-[#f4efe9]">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackPropertyImage(idx);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6e5f53]">
                    <span className="text-[#82634f] font-bold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-[#282828] group-hover:text-[#00b7a8] transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-[#5c5046] text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#00897d] hover:text-[#00b7a8] group-hover:translate-x-1 transition-all cursor-pointer"
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
