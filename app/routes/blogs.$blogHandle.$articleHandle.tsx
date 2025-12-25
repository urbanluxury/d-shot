import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `D-Shot | ${data?.article.title ?? ''}`},
    {name: 'description', content: data?.article.seo?.description || data?.article.excerpt || ''},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}, {relatedArticles}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    context.storefront.query(RELATED_ARTICLES_QUERY, {
      variables: {blogHandle},
    }),
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {handle: articleHandle, data: blog.articleByHandle},
    {handle: blogHandle, data: blog},
  );

  const article = blog.articleByHandle;

  // Filter out current article from related
  const related = relatedArticles?.articles?.nodes?.filter(
    (a: any) => a.handle !== articleHandle
  ).slice(0, 3) || [];

  return {article, blogHandle, blogTitle: blog.title, relatedArticles: related};
}

export default function Article() {
  const {article, blogHandle, blogTitle, relatedArticles} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author, tags} = article;

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Estimate reading time (average 200 words per minute)
  const wordCount = contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Image */}
      {image && (
        <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            data={image}
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
      )}

      <div className="container">
        {/* Article Header */}
        <header className={`max-w-4xl mx-auto ${image ? '-mt-32 relative z-10' : 'pt-32'}`}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link to="/blogs" className="hover:text-champagne transition-colors">Blog</Link>
            <span>/</span>
            <Link to={`/blogs/${blogHandle}`} className="hover:text-champagne transition-colors">{blogTitle}</Link>
          </nav>

          {/* Category Tag */}
          <Link
            to={`/blogs/${blogHandle}`}
            className="inline-block px-4 py-1 bg-merlot text-white text-xs font-display uppercase tracking-wider rounded-full mb-4 hover:bg-merlot/80 transition-colors"
          >
            {blogTitle}
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-8 pb-8 border-b border-white/10">
            <time dateTime={article.publishedAt} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {publishedDate}
            </time>
            {author?.name && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                By {author.name}
              </span>
            )}
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </span>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-white/50 text-sm">Share:</span>
            <ShareButton platform="twitter" title={title} />
            <ShareButton platform="facebook" />
            <ShareButton platform="linkedin" title={title} />
            <ShareButton platform="copy" />
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto pb-16">
          <div
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className="article-content prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:uppercase prose-headings:text-white
              prose-p:text-white/80 prose-p:leading-relaxed
              prose-a:text-champagne prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-blockquote:border-l-champagne prose-blockquote:bg-dark-gray/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-img:rounded-xl
              prose-li:text-white/80
              prose-hr:border-white/10"
          />

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/50 text-sm mr-2">Tags:</span>
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-dark-gray text-white/70 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {author?.name && (
            <div className="mt-12 p-6 bg-dark-gray rounded-xl flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-merlot flex items-center justify-center text-champagne font-display text-2xl flex-shrink-0">
                {author.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-display uppercase text-white mb-2">Written by {author.name}</h4>
                <p className="text-white/60 text-sm">
                  Contributing writer for the Shot Records Blog. Stay tuned for more stories, interviews, and exclusive content.
                </p>
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display uppercase text-white">More from {blogTitle}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-champagne/50 to-transparent ml-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((related: any) => (
                <Link
                  key={related.id}
                  to={`/blogs/${blogHandle}/${related.handle}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-dark-gray">
                    {related.image ? (
                      <Image
                        alt={related.image.altText || related.title}
                        data={related.image}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/50 mb-2">
                    {new Date(related.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <h3 className="font-display uppercase text-white text-lg group-hover:text-champagne transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to={`/blogs/${blogHandle}`}
                className="inline-flex items-center gap-2 text-champagne font-display uppercase text-sm hover:gap-3 transition-all"
              >
                View All {blogTitle} Posts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-display uppercase text-white mb-4">
              Never Miss a Story
            </h3>
            <p className="text-white/60 mb-8">
              Subscribe to get the latest news, exclusive content, and behind-the-scenes updates from D-Shot and Shot Records.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-dark-gray border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-champagne focus:outline-none"
              />
              <button
                type="submit"
                className="bg-champagne text-black font-display uppercase px-8 py-3 rounded-lg hover:bg-champagne/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function ShareButton({platform, title}: {platform: string; title?: string}) {
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = title || 'Check out this article';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const icons: Record<string, JSX.Element> = {
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    copy: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={handleShare}
      className="w-8 h-8 rounded-full bg-dark-gray text-white/60 hover:bg-merlot hover:text-white flex items-center justify-center transition-all"
      aria-label={`Share on ${platform}`}
    >
      {icons[platform]}
    </button>
  );
}

const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      title
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        excerpt
        tags
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;

const RELATED_ARTICLES_QUERY = `#graphql
  query RelatedArticles(
    $blogHandle: String!
  ) {
    relatedArticles: blog(handle: $blogHandle) {
      articles(first: 4, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          title
          handle
          publishedAt
          image {
            id
            altText
            url
            width
            height
          }
        }
      }
    }
  }
` as const;
