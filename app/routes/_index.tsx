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
  const [{collections}, heroData, featuredSectionData] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HERO_SETTINGS_QUERY),
    context.storefront.query(FEATURED_SECTION_QUERY),
  ]);

  // Extract hero settings from metaobject
  const heroMetaobject = heroData?.metaobject;
  const heroSettings = heroMetaobject
    ? heroMetaobject.fields.reduce(
        (acc: Record<string, string>, field: {key: string; value: string}) => {
          acc[field.key] = field.value;
          return acc;
        },
        {},
      )
    : null;

  // Extract featured section settings - find the one with section_id = 'homepage_products'
  const allSections = featuredSectionData?.metaobjects?.nodes || [];
  const featuredSectionMetaobject = allSections.find(
    (node: {fields: {key: string; value?: string | null}[]}) => {
      const sectionIdField = node.fields.find((f: {key: string}) => f.key === 'section_id');
      return sectionIdField?.value === 'homepage_products';
    },
  );
  const featuredSection = featuredSectionMetaobject
    ? featuredSectionMetaobject.fields.reduce(
        (acc: Record<string, string>, field: {key: string; value?: string | null}) => {
          acc[field.key] = field.value || '';
          return acc;
        },
        {},
      )
    : null;

  // Load products from the configured collection (if set)
  let featuredProducts = null;
  if (featuredSection?.collection_handle) {
    const {collection} = await context.storefront.query(COLLECTION_PRODUCTS_QUERY, {
      variables: {handle: featuredSection.collection_handle, first: 8},
    });
    featuredProducts = collection?.products?.nodes || null;
  }

  return {
    featuredCollection: collections.nodes[0],
    heroSettings,
    featuredSection,
    featuredProducts,
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
      <HeroSection heroSettings={data.heroSettings} />

      {/* Shop Categories */}
      <ShopCategories />

      {/* Featured Products */}
      <FeaturedProducts
        products={data.recommendedProducts}
        featuredProducts={data.featuredProducts}
        sectionSettings={data.featuredSection}
      />

      {/* About Teaser */}
      <AboutTeaser />

      {/* D-Shot Glasses Promo */}
      <ShotGlassesPromo />
    </div>
  );
}

interface HeroSettings {
  video_url?: string;
  heading?: string;
  subheading?: string;
  button_text?: string;
  button_link?: string;
}

function HeroSection({heroSettings}: {heroSettings: HeroSettings | null}) {
  // Use metaobject values with fallbacks
  const videoUrl = heroSettings?.video_url || '/hero-video-compressed.mp4';
  const heading = heroSettings?.heading || 'Bay Area Legend';
  const buttonText = heroSettings?.button_text || 'Shop Now';
  const buttonLink = heroSettings?.button_link || '/collections/all';

  return (
    <section className="hero">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay z-[1]"></div>

      <div className="hero-content">
        <p className="text-white uppercase tracking-[0.3em] mb-4 text-sm font-semibold animate-fade-in">
          {heading}
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
          <Link to={buttonLink} className="btn-primary">
            {buttonText}
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

interface FeaturedSection {
  section_id?: string;
  collection_handle?: string;
  title?: string;
  subtitle?: string;
}

function FeaturedProducts({
  products,
  featuredProducts,
  sectionSettings,
}: {
  products: Promise<RecommendedProductsQuery | null>;
  featuredProducts: RecommendedProductsQuery['products']['nodes'] | null;
  sectionSettings: FeaturedSection | null;
}) {
  // Use configured title/subtitle or defaults
  const title = sectionSettings?.title || 'New Arrivals';
  const subtitle = sectionSettings?.subtitle || 'Fresh drops from the vault';
  const collectionHandle = sectionSettings?.collection_handle || 'all';

  // If we have featured products from a specific collection, show those
  if (featuredProducts && featuredProducts.length > 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to={`/collections/${collectionHandle}`} className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to recommended products
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
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

function ShotGlassesPromo() {
  return (
    <section className="section bg-dark">
      <div className="container">
        <Link
          to="/collections/shot-glasses"
          className="block rounded-xl overflow-hidden group relative"
          style={{backgroundColor: '#722F37'}}
        >
          <div className="grid lg:grid-cols-2 items-center min-h-[400px]">
            {/* Left Content */}
            <div className="p-8 lg:p-12 relative z-10">
              <span className="badge-champagne mb-4">Luxury Collection</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-champagne mt-4 group-hover:scale-105 transition-transform origin-left">
                D.Shot
              </h2>
              <p className="text-3xl md:text-4xl font-display uppercase text-white mt-2">
                Shot Glasses
              </p>
              <p className="text-white/80 mt-4 text-lg">
                Premium luxury shot glasses. Elevate your drinking experience.
              </p>
              <span className="btn-primary mt-6 inline-block bg-champagne text-black hover:bg-white">
                Coming Soon
              </span>
            </div>

            {/* Right Image */}
            <div className="relative h-full flex items-center justify-center p-8">
              <img
                src="/dshot-glasses-promo.png"
                alt="D-Shot Luxury Shot Glasses"
                className="max-h-[350px] w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform"
              />
            </div>
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

const HERO_SETTINGS_QUERY = `#graphql
  query HeroSettings {
    metaobject(handle: {type: "hero_settings", handle: "homepage"}) {
      fields {
        key
        value
      }
    }
  }
` as const;

const FEATURED_SECTION_QUERY = `#graphql
  query FeaturedSection {
    metaobjects(type: "featured_section", first: 10) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }
` as const;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
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
      }
    }
  }
` as const;
