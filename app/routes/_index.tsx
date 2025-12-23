import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'D-Shot | Official Store - Shot Caller Records'},
    {
      name: 'description',
      content:
        'Official merchandise and music from Bay Area legend D-Shot. Shop exclusive apparel, vinyl, and more from Shot Caller Records.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      {/* Hero Section */}
      <HeroSection />

      {/* Shop Categories */}
      <ShopCategories />

      {/* Featured Products */}
      <FeaturedProducts products={data.recommendedProducts} />

      {/* About Teaser */}
      <AboutTeaser />

      {/* Latest Drop Banner */}
      <LatestDropBanner collection={data.featuredCollection} />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="text-white uppercase tracking-[0.3em] mb-4 text-sm font-semibold animate-fade-in">
          Bay Area Legend
        </p>
        <img
          src="/dshot-logo.png"
          alt="D-Shot Official"
          className="h-32 md:h-40 lg:h-48 mx-auto mb-6 animate-slide-up drop-shadow-2xl"
        />
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-slide-up"
          style={{animationDelay: '0.2s'}}
        >
          <Link to="/collections/all" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/music" className="btn-outline">
            Listen
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

// Custom icons - Bay Area aesthetic
function CrownIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20M4 20l2-14 4 6 2-8 2 8 4-6 2 14" />
    </svg>
  );
}

function VinylIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
    </svg>
  );
}

function ChainIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function StarIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ShopCategories() {
  const categories = [
    {
      title: 'Apparel',
      description: 'T-Shirts, Hoodies & Hats',
      handle: 'apparel',
      icon: CrownIcon,
    },
    {
      title: 'Music',
      description: 'Vinyl, CDs & Digital',
      handle: 'music',
      icon: VinylIcon,
    },
    {
      title: 'Accessories',
      description: 'Jewelry, Lighters & More',
      handle: 'accessories',
      icon: ChainIcon,
    },
    {
      title: 'Exclusives',
      description: 'Limited Drops & Signed Items',
      handle: 'exclusives',
      icon: StarIcon,
    },
  ];

  return (
    <section className="section bg-dark">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop the Collection</h2>
          <p className="section-subtitle">Official Shot Caller Merchandise</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.handle}
              to={`/collections/${category.handle}`}
              className="group bg-dark-gray rounded-lg p-8 text-center hover:bg-gray transition-all duration-300 hover:-translate-y-1"
            >
              <category.icon className="w-10 h-10 mx-auto mb-4 text-merlot group-hover:text-champagne transition-colors" />
              <h3 className="text-xl font-display uppercase text-white group-hover:text-champagne transition-colors">
                {category.title}
              </h3>
              <p className="text-white/60 text-sm mt-2">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Fresh drops from the vault</p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <Await resolve={products}>
            {(response) => (
              <>
                <div className="product-grid">
                  {response?.products.nodes.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <Link to="/collections/all" className="btn-outline">
                    View All Products
                  </Link>
                </div>
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function ProductCard({
  product,
}: {
  product: RecommendedProductsQuery['products']['nodes'][0];
}) {
  const image = product.featuredImage;

  return (
    <Link
      to={`/products/${product.handle}`}
      className="product-card"
      prefetch="intent"
    >
      <div className="product-card-image">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            No image
          </div>
        )}
      </div>
      <div className="product-card-info">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-price">
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
    </Link>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="product-grid">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-square bg-gray"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray rounded w-3/4"></div>
            <div className="h-4 bg-gray rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutTeaser() {
  return (
    <section className="section bg-gradient-to-r from-merlot/20 to-transparent">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-merlot uppercase tracking-widest text-sm font-semibold mb-4">
              The Legend
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase text-white mb-6">
              D-Shot
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              From the streets of Vallejo to the top of the Bay Area hip-hop scene,
              D-Shot has been a driving force in West Coast music for decades.
              As a founding member and the CEO of Sick Wid It Records, he's helped
              shape the sound of an entire generation.
            </p>
            <Link to="/about" className="btn-secondary">
              Read More
            </Link>
          </div>
          <div className="aspect-square bg-dark-gray rounded-lg overflow-hidden">
            {/* Placeholder for D-Shot image */}
            <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl">
              📷
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestDropBanner({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;

  return (
    <section className="section bg-dark">
      <div className="container">
        <Link
          to={`/collections/${collection.handle}`}
          className="block bg-gradient-to-r from-merlot to-merlot-dark rounded-xl overflow-hidden group"
        >
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-8 lg:p-12">
              <span className="badge-champagne mb-4">New Collection</span>
              <h2 className="text-3xl md:text-4xl font-display uppercase text-white mt-4 group-hover:text-champagne transition-colors">
                {collection.title}
              </h2>
              <p className="text-white/80 mt-4">
                Check out the latest exclusive drop from Shot Caller Records.
              </p>
              <span className="btn-outline mt-6 inline-block">
                Shop Collection
              </span>
            </div>
            {collection.image && (
              <div className="aspect-video lg:aspect-square">
                <Image
                  data={collection.image}
                  sizes="(min-width: 45em) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
