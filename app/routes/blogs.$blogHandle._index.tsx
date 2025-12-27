import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PageHero} from '~/components/PageHero';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `D-Shot | ${data?.blog.title ?? ''} - Shot Records Blog`}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!params.blogHandle) {
    throw new Response(`Blog not found`, {status: 404});
  }

  const [{blog}, {blogs}] = await Promise.all([
    context.storefront.query(BLOG_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    context.storefront.query(ALL_BLOGS_QUERY),
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog, allBlogs: blogs.nodes};
}

export default function Blog() {
  const {blog, allBlogs} = useLoaderData<typeof loader>();
  const {articles} = blog;

  const featuredArticle = articles.nodes[0];
  const otherArticles = articles.nodes.slice(1);

  // Get description based on blog handle
  const blogDescriptions: Record<string, string> = {
    news: 'The latest news, announcements, and updates from D-Shot and Shot Records.',
    events: 'Upcoming shows, appearances, and events featuring D-Shot and Shot Records artists.',
    releases: 'New music releases, album drops, and exclusive content from the Shot Records family.',
    artists: 'Profiles, interviews, and features on Shot Records artists and collaborators.',
    default: 'Stories, news, and updates from D-Shot and Shot Records.',
  };

  const description = blogDescriptions[blog.handle] || blogDescriptions.default;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <PageHero
        title={blog.title}
        subtitle={description}
        label="Blog"
      />

      <div className="container py-12">
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <Link
            to="/blogs"
            className="px-6 py-2 rounded-full border border-white/20 text-white/70 hover:border-champagne hover:text-champagne transition-all text-sm font-display uppercase tracking-wider"
          >
            All Posts
          </Link>
          {allBlogs.map((b: any) => (
            <Link
              key={b.handle}
              to={`/blogs/${b.handle}`}
              className={`px-6 py-2 rounded-full border text-sm font-display uppercase tracking-wider transition-all ${
                b.handle === blog.handle
                  ? 'border-champagne bg-champagne text-black'
                  : 'border-white/20 text-white/70 hover:border-champagne hover:text-champagne'
              }`}
            >
              {b.title}
            </Link>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <Link
              to={`/blogs/${blog.handle}/${featuredArticle.handle}`}
              className="group block"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-dark-gray">
                  {featuredArticle.image ? (
                    <Image
                      alt={featuredArticle.image.altText || featuredArticle.title}
                      data={featuredArticle.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <span className="inline-block px-4 py-1 bg-merlot text-white text-xs font-display uppercase tracking-wider rounded-full mb-4">
                    Latest
                  </span>
                  <h2 className="text-3xl md:text-4xl font-display uppercase text-white mb-4 group-hover:text-champagne transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
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
                  {featuredArticle.excerpt && (
                    <p className="text-white/70 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-2 text-champagne font-display uppercase text-sm group-hover:gap-3 transition-all">
                    Read Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Article Grid */}
        {otherArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display uppercase text-white">More in {blog.title}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-champagne/50 to-transparent ml-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article: any, index: number) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  blogHandle={blog.handle}
                  loading={index < 6 ? 'eager' : 'lazy'}
                />
              ))}
            </div>

            {/* Load More / Pagination */}
            {articles.pageInfo.hasNextPage && (
              <div className="text-center mt-12">
                <Link
                  to={`?cursor=${articles.pageInfo.endCursor}`}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-champagne text-champagne font-display uppercase text-sm rounded-lg hover:bg-champagne hover:text-black transition-all"
                >
                  Load More Articles
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {articles.nodes.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-white/10 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-2xl font-display uppercase text-white mb-4">No Articles Yet</h3>
            <p className="text-white/60 mb-8">Check back soon for new content in this category.</p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-champagne font-display uppercase text-sm hover:gap-3 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to All Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  blogHandle,
  loading,
}: {
  article: any;
  blogHandle: string;
  loading?: 'eager' | 'lazy';
}) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blogs/${blogHandle}/${article.handle}`}
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
        <time dateTime={article.publishedAt}>{publishedDate}</time>
        {article.author?.name && (
          <>
            <span>&bull;</span>
            <span>{article.author.name}</span>
          </>
        )}
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

const BLOG_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: PUBLISHED_AT,
        reverse: true
      ) {
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
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

const ALL_BLOGS_QUERY = `#graphql
  query AllBlogs {
    blogs(first: 10) {
      nodes {
        title
        handle
      }
    }
  }
` as const;
