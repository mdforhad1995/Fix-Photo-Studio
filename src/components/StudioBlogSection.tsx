import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Eye,
  FolderOpen,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  DEFAULT_BLOG_FAQS,
  ServiceDefinition,
  StudioBlogPost,
} from '../data/studioCatalog';
import { BeforeAfterStudioCanvas } from './StudioArtworks';
import { RichContentRenderer } from './RichTextEditor';

interface StudioBlogSectionProps {
  blogPosts: StudioBlogPost[];
  onReadBlogPost: (slug: string) => void;
  onOpenAllBlogsPage: () => void;
}

/**
 * Home Page Blog Section (Placed right after Customer Reviews)
 * - No category menu list in the header (per user screenshot)
 * - Displays the newest blog post 1st (#1)
 * - Clicking "Read Article" opens the dedicated Single Blog Page (#blogs/<slug>)
 */
export const StudioBlogSection: React.FC<StudioBlogSectionProps> = ({
  blogPosts,
  onReadBlogPost,
  onOpenAllBlogsPage,
}) => {
  // Show top 3 latest blog posts on the Home Page (index 0 is always the newest #1 blog)
  const homePosts = blogPosts.slice(0, 3);

  return (
    <section
      id="blog"
      className="border-t border-[#DCE6F2] bg-[#F5F9FD] py-16"
    >
      <div className="max-w-[1360px] mx-auto px-6 space-y-10">
        {/* Clean Header (No category filter tabs menu list) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-[#0088FF] font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>STUDIO POST-PRODUCTION JOURNAL &amp; GUIDES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
              Latest Commercial Photo &amp; Video Editing Blog
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Technical breakdowns, e-commerce marketplace compliance guides, and workflow insights from our senior retouching and 4K video pods. The newest article always appears first.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAllBlogsPage}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#DCE6F2] text-xs font-bold transition-colors flex items-center gap-2 self-start sm:self-end whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>View All Blogs ({blogPosts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Blog Posts 3-Card Grid (Latest Post is #1 First) */}
        {homePosts.length === 0 ? (
          <div className="bg-white border border-[#DCE6F2] rounded-2xl p-10 text-center text-xs text-slate-500">
            No blog posts published yet. Add a new blog post from the Admin Panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homePosts.map((post, idx) => {
              const isLatestFirst = idx === 0;

              return (
                <article
                  key={post.id}
                  className={`bg-white rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-xs ${
                    isLatestFirst
                      ? 'border-2 border-[#0088FF] ring-2 ring-[#0088FF]/10'
                      : 'border border-[#DCE6F2] hover:border-[#0088FF]'
                  }`}
                >
                  <div>
                    {/* Cover Media */}
                    <div
                      onClick={() => onReadBlogPost(post.slug)}
                      className="relative h-56 bg-[#001E5A] overflow-hidden cursor-pointer group"
                    >
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <BeforeAfterStudioCanvas
                          artworkType={post.artworkType || 'watch'}
                          initialSplit={52}
                          interactive={false}
                          className="h-56 pointer-events-none"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-md bg-[#001E5A]/90 backdrop-blur-xs text-white font-mono-tabular text-[11px] font-semibold">
                          {post.category}
                        </span>
                        {isLatestFirst && (
                          <span className="px-2.5 py-1 rounded-md bg-[#0088FF] text-white font-mono-tabular text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" />
                            <span>NEWEST · #1</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-tabular text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0088FF]" />
                          <span>{post.publishedAt}</span>
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0088FF]" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => onReadBlogPost(post.slug)}
                        className="text-base font-bold text-[#001E5A] hover:text-[#0088FF] cursor-pointer leading-snug transition-colors"
                      >
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                      <div className="w-6 h-6 rounded-full bg-[#EAF3FC] text-[#001E5A] flex items-center justify-center font-bold text-[11px] shrink-0">
                        {post.authorName
                          ? post.authorName.charAt(0).toUpperCase()
                          : 'F'}
                      </div>
                      <span className="font-semibold text-[#001E5A] truncate">
                        {post.authorName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onReadBlogPost(post.slug)}
                      className="px-3 py-1.5 rounded-lg bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

interface StudioBlogsPageProps {
  mode: 'all_blogs' | 'single_blog';
  blogPosts: StudioBlogPost[];
  activeBlogSlug?: string;
  servicesList: ServiceDefinition[];
  onSelectBlogSlug: (slug: string) => void;
  onOpenAllBlogs: () => void;
  onBackToHome: () => void;
  onExploreServiceSlug: (slug: string) => void;
  onOpenFreeTrial: () => void;
  onOpenGetQuote: () => void;
}

/**
 * Dedicated `/blogs` (#blogs) Page & Single Blog Article Page (#blogs/<slug>)
 * Includes:
 * - Main Left Column (lg:col-span-8):
 *   - Either All Blogs Directory OR Single Full Blog Article
 *   - Frequently Asked Questions (FAQ) Accordion Section below
 * - Right Sidebar (lg:col-span-4):
 *   1. Blog Categories widget
 *   2. Most Viewed 5 Posts widget
 *   3. Free 5-Image Quality Test dark navy CTA card
 *   4. Related Studio Services pricing links card
 */
export const StudioBlogsPage: React.FC<StudioBlogsPageProps> = ({
  mode,
  blogPosts,
  activeBlogSlug,
  servicesList,
  onSelectBlogSlug,
  onOpenAllBlogs,
  onBackToHome,
  onExploreServiceSlug,
  onOpenFreeTrial,
  onOpenGetQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  // Active post when in single_blog mode
  const activePost =
    blogPosts.find((b) => b.slug === activeBlogSlug) || blogPosts[0];

  // Category counts for the Sidebar Category Widget
  const categoryCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    blogPosts.forEach((b) => {
      const cat = b.category || 'Studio Guide';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [blogPosts]);

  // Most Viewed 5 Posts for the Sidebar Widget
  const mostViewed5Posts = React.useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => (b.viewsCount || 1500) - (a.viewsCount || 1500))
      .slice(0, 5);
  }, [blogPosts]);

  // Filtered posts for the /blogs directory view
  const filteredDirectoryPosts =
    selectedCategory === 'ALL'
      ? blogPosts
      : blogPosts.filter((b) => b.category === selectedCategory);

  // Related Studio Services for the Sidebar (matches Screenshot 2: 01. Clipping Path, 02. Background Removal, 03. Image Masking, 04. Ghost Mannequin)
  const sidebarRelatedServices = React.useMemo(() => {
    const photoServices = servicesList.filter(
      (s) => s.division === 'photo_editing'
    );
    return photoServices.slice(0, 4);
  }, [servicesList]);

  // FAQs to render in the FAQ Accordion section
  const activeFaqs =
    mode === 'single_blog' &&
    activePost?.faqs &&
    activePost.faqs.length > 0
      ? activePost.faqs
      : DEFAULT_BLOG_FAQS;

  const relatedServiceObj = activePost?.relatedServiceSlug
    ? servicesList.find((s) => s.slug === activePost.relatedServiceSlug)
    : servicesList[0];

  return (
    <div className="bg-[#F5F9FD] min-h-screen pb-20">
      {/* Top Breadcrumb & Page Hero Header */}
      <section className="bg-gradient-to-b from-[#EAF3FC] to-[#F5F9FD] border-b border-[#DCE6F2] py-10">
        <div className="max-w-[1360px] mx-auto px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-slate-600">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-[#0088FF] hover:underline font-semibold"
              >
                Home
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  onOpenAllBlogs();
                }}
                className={`hover:underline font-semibold ${
                  mode === 'all_blogs' ? 'text-[#001E5A]' : 'text-[#0088FF]'
                }`}
              >
                blogs
              </button>
              {mode === 'single_blog' && activePost && (
                <>
                  <span>/</span>
                  <span className="text-[#001E5A] font-semibold truncate max-w-xs sm:max-w-md">
                    {activePost.title}
                  </span>
                </>
              )}
            </div>

            {mode === 'single_blog' ? (
              <button
                type="button"
                onClick={onOpenAllBlogs}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#DCE6F2] text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Blogs (/blogs)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#001E5A] text-[#001E5A] hover:text-white border border-[#DCE6F2] text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            )}
          </div>

          {mode === 'all_blogs' ? (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold uppercase">
                FIXPHOTO STUDIO OFFICIAL BLOG ARCHIVE · /BLOGS
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#001E5A] tracking-tight">
                Commercial Photo &amp; 4K Video Post-Production Blog
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Explore technical retouching tutorials, e-commerce marketplace compliance guides, and workflow case studies. Newest published blog posts always appear first (#1).
              </p>
            </div>
          ) : (
            activePost && (
              <div className="space-y-3 pt-1 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-tabular">
                  <span className="px-2.5 py-1 rounded-md bg-[#001E5A] text-white font-semibold">
                    {activePost.category}
                  </span>
                  {blogPosts[0]?.id === activePost.id && (
                    <span className="px-2.5 py-1 rounded-md bg-[#0088FF] text-white font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>NEWEST · #1</span>
                    </span>
                  )}
                  <span className="text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0088FF]" />
                    <span>{activePost.publishedAt}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#0088FF]" />
                    <span>{activePost.readTime}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#0088FF]" />
                    <span>
                      {(activePost.viewsCount || 2450).toLocaleString()} views
                    </span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold text-[#001E5A] leading-tight">
                  {activePost.title}
                </h1>

                <div className="flex items-center gap-2.5 text-xs text-slate-600 pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#001E5A] text-white flex items-center justify-center font-bold text-xs">
                    {activePost.authorName
                      ? activePost.authorName.charAt(0).toUpperCase()
                      : 'F'}
                  </div>
                  <div>
                    <span className="font-bold text-[#001E5A]">
                      {activePost.authorName}
                    </span>
                    <span className="text-slate-500">
                      {' '}
                      · {activePost.authorRole}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Main 2-Column Layout: Left 8 Cols (Blogs or Single Article + FAQ) | Right 4 Cols (Sidebar) */}
      <section className="max-w-[1360px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===============================================================
              LEFT 8 COLUMNS: BLOG LIST OR SINGLE BLOG ARTICLE + FAQ SECTION
             =============================================================== */}
          <div className="lg:col-span-8 space-y-12">
            {mode === 'all_blogs' ? (
              /* ALL BLOGS DIRECTORY VIEW (/blogs) */
              <div className="space-y-6">
                {selectedCategory !== 'ALL' && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#DCE6F2] flex items-center justify-between text-xs">
                    <span>
                      Showing articles in category:{' '}
                      <strong className="text-[#0088FF]">
                        {selectedCategory}
                      </strong>{' '}
                      ({filteredDirectoryPosts.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('ALL')}
                      className="text-xs font-bold text-[#001E5A] hover:text-[#0088FF] underline"
                    >
                      Show All Blogs ({blogPosts.length})
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDirectoryPosts.map((post) => {
                    const isLatestFirst = blogPosts[0]?.id === post.id;
                    return (
                      <article
                        key={post.id}
                        className={`bg-white rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-xs ${
                          isLatestFirst
                            ? 'border-2 border-[#0088FF] ring-2 ring-[#0088FF]/10'
                            : 'border border-[#DCE6F2] hover:border-[#0088FF]'
                        }`}
                      >
                        <div>
                          <div
                            onClick={() => onSelectBlogSlug(post.slug)}
                            className="relative h-52 bg-[#001E5A] overflow-hidden cursor-pointer group"
                          >
                            {post.coverImageUrl ? (
                              <img
                                src={post.coverImageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <BeforeAfterStudioCanvas
                                artworkType={post.artworkType || 'watch'}
                                initialSplit={52}
                                interactive={false}
                                className="h-52 pointer-events-none"
                              />
                            )}

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                              <span className="px-2.5 py-1 rounded-md bg-[#001E5A]/90 backdrop-blur-xs text-white font-mono-tabular text-[11px] font-semibold">
                                {post.category}
                              </span>
                              {isLatestFirst && (
                                <span className="px-2.5 py-1 rounded-md bg-[#0088FF] text-white font-mono-tabular text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                  <Sparkles className="w-3 h-3" />
                                  <span>NEWEST · #1</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-tabular text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#0088FF]" />
                                <span>{post.publishedAt}</span>
                              </span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#0088FF]" />
                                <span>{post.readTime}</span>
                              </span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-[#0088FF]" />
                                <span>
                                  {(post.viewsCount || 2400).toLocaleString()}
                                </span>
                              </span>
                            </div>

                            <h2
                              onClick={() => onSelectBlogSlug(post.slug)}
                              className="text-base font-bold text-[#001E5A] hover:text-[#0088FF] cursor-pointer leading-snug transition-colors"
                            >
                              {post.title}
                            </h2>

                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[#001E5A] truncate">
                            {post.authorName}
                          </span>

                          <button
                            type="button"
                            onClick={() => onSelectBlogSlug(post.slug)}
                            className="px-3 py-1.5 rounded-lg bg-[#EAF3FC] hover:bg-[#001E5A] text-[#001E5A] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* SINGLE BLOG FULL ARTICLE VIEW (#blogs/<slug>) */
              activePost && (
                <article className="bg-white border border-[#DCE6F2] rounded-2xl overflow-hidden shadow-xs">
                  {/* Interactive or Uploaded Cover Banner */}
                  <div className="relative h-72 sm:h-96 bg-[#001E5A] overflow-hidden">
                    {activePost.coverImageUrl ? (
                      <img
                        src={activePost.coverImageUrl}
                        alt={activePost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BeforeAfterStudioCanvas
                        artworkType={activePost.artworkType || 'watch'}
                        initialSplit={50}
                        interactive={true}
                        className="h-72 sm:h-96"
                      />
                    )}
                  </div>

                  {/* Full Article Body */}
                  <div className="p-6 sm:p-10 space-y-6">
                    <div className="p-4 rounded-xl bg-[#F5F9FD] border-l-4 border-[#0088FF] text-sm sm:text-base font-semibold text-[#001E5A] leading-relaxed">
                      {activePost.excerpt}
                    </div>

                    <RichContentRenderer
                      content={activePost.content}
                      className="text-sm sm:text-[15px] text-slate-700 leading-relaxed"
                    />

                    {/* Author & Related Service Footer inside Article */}
                    <div className="pt-6 border-t border-[#DCE6F2] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF3FC] text-[#001E5A] flex items-center justify-center font-bold text-sm">
                          <User className="w-5 h-5 text-[#0088FF]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#001E5A]">
                            Written by {activePost.authorName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {activePost.authorRole} · FixPhoto Studio
                          </p>
                        </div>
                      </div>

                      {relatedServiceObj && (
                        <button
                          type="button"
                          onClick={() =>
                            onExploreServiceSlug(relatedServiceObj.slug)
                          }
                          className="px-4 py-2.5 rounded-xl bg-[#0088FF] hover:bg-[#001E5A] text-white text-xs font-bold transition-colors flex items-center gap-2"
                        >
                          <span>
                            Explore {relatedServiceObj.shortNavTitle}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}

            {/* =============================================================
                BLOG PAGE FAQ ACCORDION SECTION (MATCHES SCREENSHOT 2)
               ============================================================= */}
            <div className="bg-white border border-[#DCE6F2] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE6F2] pb-4">
                <div>
                  <p className="text-xs font-mono-tabular text-[#0088FF] font-semibold uppercase">
                    SERVICE FAQ &amp; TECHNICAL ANSWERS
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#001E5A] mt-1">
                    Frequently Asked Questions —{' '}
                    {mode === 'single_blog' && activePost
                      ? activePost.category
                      : 'Photo & Video Retouching Services'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 max-w-xs">
                  Need custom specifications? Use our Free Trial or Get a Quote page for a tailored response within 15 minutes.
                </p>
              </div>

              <div className="space-y-3">
                {activeFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.question}
                      className={`rounded-xl border transition-colors ${
                        isOpen
                          ? 'bg-[#F5F9FD] border-[#0088FF]'
                          : 'bg-white border-[#DCE6F2] hover:border-[#B8D0EB]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                      >
                        <span className="text-sm font-bold text-[#001E5A]">
                          0{idx + 1}. {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#0088FF] shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 border-t border-[#DCE6F2]/70 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===============================================================
              RIGHT 4 COLUMNS SIDEBAR:
              1. BLOG CATEGORIES
              2. MOST VIEWED 5 POSTS
              3. FREE 5-IMAGE QUALITY TEST (DARK NAVY CARD)
              4. RELATED STUDIO SERVICES
             =============================================================== */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* 1. BLOG CATEGORIES WIDGET */}
            <div className="bg-white border border-[#DCE6F2] rounded-2xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-2.5">
                <p className="text-xs font-mono-tabular font-bold text-[#001E5A] flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-[#0088FF]" />
                  <span>BLOG CATEGORIES</span>
                </p>
                <span className="text-[11px] font-mono-tabular text-slate-500">
                  {categoryCounts.length} Categories
                </span>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    if (mode === 'single_blog') {
                      onOpenAllBlogs();
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    mode === 'all_blogs' && selectedCategory === 'ALL'
                      ? 'bg-[#001E5A] text-white'
                      : 'bg-[#F5F9FD] hover:bg-[#EAF3FC] text-[#001E5A]'
                  }`}
                >
                  <span>All Blog Articles</span>
                  <span className="font-mono-tabular font-bold">
                    {blogPosts.length}
                  </span>
                </button>

                {categoryCounts.map(([cat, count]) => {
                  const isActiveCat =
                    (mode === 'all_blogs' && selectedCategory === cat) ||
                    (mode === 'single_blog' && activePost?.category === cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (mode === 'single_blog') {
                          onOpenAllBlogs();
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        isActiveCat
                          ? 'bg-[#0088FF] text-white'
                          : 'bg-[#F5F9FD] hover:bg-[#EAF3FC] text-[#001E5A]'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span className="font-mono-tabular font-bold shrink-0">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. MOST VIEWED 5 POSTS WIDGET */}
            <div className="bg-white border border-[#DCE6F2] rounded-2xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-2.5">
                <p className="text-xs font-mono-tabular font-bold text-[#001E5A] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#0088FF]" />
                  <span>MOST VIEWED 5 POSTS</span>
                </p>
                <span className="text-[11px] font-mono-tabular text-[#0088FF] font-semibold">
                  Top 5 Articles
                </span>
              </div>

              <div className="space-y-2.5">
                {mostViewed5Posts.map((post, idx) => {
                  const isCurrent =
                    mode === 'single_blog' && activePost?.id === post.id;
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => onSelectBlogSlug(post.slug)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                        isCurrent
                          ? 'bg-[#EAF3FC] border-[#0088FF]'
                          : 'bg-[#F5F9FD] hover:bg-[#EAF3FC] border-[#DCE6F2]'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#001E5A] text-white font-mono-tabular text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-xs font-bold text-[#001E5A] group-hover:text-[#0088FF] leading-snug line-clamp-2">
                          {post.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono-tabular text-slate-500">
                          <span>{post.category}</span>
                          <span className="text-[#0088FF] font-semibold">
                            {(post.viewsCount || 2400).toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. FREE 5-IMAGE QUALITY TEST CARD (FROM SCREENSHOT 2) */}
            <div className="bg-[#001E5A] text-white rounded-2xl p-6 space-y-4 shadow-sm">
              <p className="text-xs font-mono-tabular text-[#00B8FF] font-semibold">
                FREE 5-IMAGE QUALITY TEST
              </p>
              <h3 className="text-lg font-bold leading-snug">
                Try Photo Retouching Services Before You Commit
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Upload up to 5 RAW or studio files for a complimentary test batch executed by our senior specialists.
              </p>
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={onOpenFreeTrial}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#001E5A] bg-white hover:bg-[#EAF3FC] rounded-lg transition-colors"
                >
                  Start Free 5-File Trial →
                </button>
                <button
                  type="button"
                  onClick={onOpenGetQuote}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0088FF] hover:bg-[#006FE0] rounded-lg transition-colors"
                >
                  Request Bulk Volume Quote →
                </button>
              </div>
            </div>

            {/* 4. RELATED STUDIO SERVICES CARD (FROM SCREENSHOT 2) */}
            <div className="bg-[#F5F9FD] border border-[#DCE6F2] rounded-2xl p-5 space-y-3 shadow-xs">
              <p className="text-xs font-mono-tabular font-bold text-[#001E5A]">
                RELATED STUDIO SERVICES
              </p>
              <div className="space-y-2">
                {sidebarRelatedServices.map((rel) => (
                  <button
                    key={rel.slug}
                    type="button"
                    onClick={() => onExploreServiceSlug(rel.slug)}
                    className="w-full p-2.5 rounded-lg bg-white hover:bg-[#EAF3FC] border border-[#DCE6F2] text-left flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-semibold text-[#001E5A]">
                      {rel.indexNumber}. {rel.shortNavTitle}
                    </span>
                    <span className="font-mono-tabular text-[#0088FF] font-bold">
                      ${rel.ratePerImage.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
