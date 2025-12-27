import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PageHero} from '~/components/PageHero';

export const meta: Route.MetaFunction = () => {
  return [{title: `D-Shot | The Shot Records Blog - News, Events & Releases`}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
  ]);

  // Get all articles from all blogs for the main landing
  const allArticles: any[] = [];
  for (const blog of blogs.nodes) {
    if (blog.articles?.nodes) {
      blog.articles.nodes.forEach((article: any) => {
        allArticles.push({
          ...article,
          blogHandle: blog.handle,
          blogTitle: blog.title,
        });
      });
    }
  }

  // Sort by date
  allArticles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return {blogs, allArticles};
}

export default function Blogs() {
  const {blogs, allArticles} = useLoaderData<typeof loader>();

  const featuredArticle = allArticles[0];
  const recentArticles = allArticles.slice(1, 7);
  const olderArticles = allArticles.slice(7);

  // Blog categories for navigation
  const categories = blogs.nodes.map((blog: any) => ({
    title: blog.title,
    handle: blog.handle,
    articleCount: blog.articles?.nodes?.length || 0,
  }));

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <PageHero
        title="The Shot Records Blog"
        subtitle="News, Stories, Events & Releases from D-Shot and Shot Records Artists"
        label="Blog"
      />

      <div className="container py-12">
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <Link
            to="/blogs/news"
            className="px-6 py-2 rounded-full border border-champagne/30 text-champagne hover:bg-champagne hover:text-black transition-all text-sm font-display uppercase tracking-wider"
          >
            All Posts
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.handle}
              to={`/blogs/${cat.handle}`}
              className="px-6 py-2 rounded-full border border-white/20 text-white/70 hover:border-champagne hover:text-champagne transition-all text-sm font-display uppercase tracking-wider"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <Link
              to={`/blogs/${featuredArticle.blogHandle}/${featuredArticle.handle}`}
              className="group block"
            >
              <div className="relative rounded-2xl overflow-hidden">
                {featuredArticle.image ? (
                  <Image
                    alt={featuredArticle.image.altText || featuredArticle.title}
                    data={featuredArticle.image}
                    className="w-full aspect-[21/9] object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                  />
                ) : (
                  <div className="w-full aspect-[21/9] bg-dark-gray flex items-center justify-center">
                    <svg className="w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="inline-block px-4 py-1 bg-merlot text-white text-xs font-display uppercase tracking-wider rounded-full mb-4">
                    Featured
                  </span>
                  <h2 className="text-3xl md:text-5xl font-display uppercase text-white mb-4 group-hover:text-champagne transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="text-champagne">{featuredArticle.blogTitle}</span>
                    <span>&bull;</span>
                    <time dateTime={featuredArticle.publishedAt}>
                      {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {featuredArticle.author?.name && (
                      <>
                        <span>&bull;</span>
                        <span>By {featuredArticle.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Recent Articles Grid */}
        {recentArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display uppercase text-white">Latest Stories</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-champagne/50 to-transparent ml-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map((article: any, index: number) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Older Articles */}
        {olderArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display uppercase text-white">More Stories</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-champagne/50 to-transparent ml-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {olderArticles.map((article: any) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="mt-20 bg-gradient-to-br from-merlot/20 to-dark-gray rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-display uppercase text-white mb-4">
            Stay in the Loop
          </h3>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Get exclusive stories, behind-the-scenes content, and be the first to know about new releases and events.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-champagne focus:outline-none"
            />
            <button
              type="submit"
              className="bg-champagne text-black font-display uppercase px-8 py-3 rounded-lg hover:bg-champagne/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  loading,
}: {
  article: any;
  loading?: 'eager' | 'lazy';
}) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blogs/${article.blogHandle}/${article.handle}`}
      className="group block"
    >
      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-dark-gray">
        {article.image ? (
          <Image
            alt={article.image.altText || article.title}
            data={article.image}
            loading={loading}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm text-white/50 mb-2">
        <span className="text-champagne font-medium">{article.blogTitle}</span>
        <span>&bull;</span>
        <time dateTime={article.publishedAt}>{publishedDate}</time>
      </div>
      <h3 className="font-display uppercase text-white text-xl group-hover:text-champagne transition-colors line-clamp-2">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-white/60 text-base mt-2 line-clamp-2">{article.excerpt}</p>
      )}
    </Link>
  );
}

function ArticleListItem({article}: {article: any}) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blogs/${article.blogHandle}/${article.handle}`}
      className="group flex gap-4 p-4 rounded-xl bg-dark-gray/50 hover:bg-dark-gray transition-colors"
    >
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-dark-gray">
        {article.image ? (
          <Image
            alt={article.image.altText || article.title}
            data={article.image}
            loading="lazy"
            className="w-full h-full object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
          <span className="text-champagne">{article.blogTitle}</span>
          <span>&bull;</span>
          <time dateTime={article.publishedAt}>{publishedDate}</time>
        </div>
        <h3 className="font-display uppercase text-white text-base group-hover:text-champagne transition-colors line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
        articles(first: 10, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            publishedAt
            excerpt
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
          }
        }
      }
    }
  }
` as const;
