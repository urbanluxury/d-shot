import {useState} from 'react';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Image, Money} from '@shopify/hydrogen';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'D-Shot | Official Store - Shot Records'},
    {
      name: 'description',
      content:
        'Official store of D-Shot (Danell Stevens), founding member of The Click and brother of E-40. Shop exclusive merch, vinyl, and music from the Vallejo legend. Est. 1995 - Shot Records.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const [heroData, eventsData, collectionsData, featuredAlbumData] = await Promise.all([
    context.storefront.query(HERO_SETTINGS_QUERY),
    context.storefront.query(EVENTS_QUERY),
    context.storefront.query(HOMEPAGE_COLLECTIONS_QUERY),
    context.storefront.query(FEATURED_ALBUM_QUERY),
  ]);

  // Extract hero settings from metaobject
  const heroMetaobject = heroData?.metaobject;
  const heroSettings: HeroSettings | null = heroMetaobject
    ? heroMetaobject.fields.reduce(
        (acc: Record<string, string>, field) => {
          acc[field.key] = field.value || '';
          return acc;
        },
        {} as Record<string, string>,
      ) as unknown as HeroSettings
    : null;

  // Parse events from metaobject
  const events = eventsData?.metaobjects?.nodes?.map((node: any) => {
    return node.fields.reduce((acc: any, field: any) => {
      acc[field.key] = field.value;
      return acc;
    }, {});
  }) || [];

  // Get products by collection for tabs
  const collectionProducts = {
    'new-arrivals': collectionsData?.newArrivals?.products?.nodes || [],
    'apparel': collectionsData?.apparel?.products?.nodes || [],
    'accessories': collectionsData?.accessories?.products?.nodes || [],
    'shot-glasses': collectionsData?.shotGlasses?.products?.nodes || [],
    'exclusives': collectionsData?.exclusives?.products?.nodes || [],
  };

  // Get featured album (find one with is_featured = true, or just get first one)
  const albums = featuredAlbumData?.metaobjects?.nodes || [];
  const featuredAlbumNode = albums.find((node: any) => {
    const isFeatured = node.fields.find((f: any) => f.key === 'is_featured');
    return isFeatured?.value === 'true';
  }) || albums[0];

  const featuredAlbum = featuredAlbumNode
    ? featuredAlbumNode.fields.reduce((acc: any, field: any) => {
        if (field.key === 'cover_art' && field.reference) {
          acc.coverArtUrl = field.reference.image?.url || null;
        } else {
          acc[field.key] = field.value;
        }
        return acc;
      }, {})
    : null;

  return {
    heroSettings,
    events,
    collectionProducts,
    featuredAlbum,
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

      {/* New Arrivals with Tabs */}
      <NewArrivalsSection collectionProducts={data.collectionProducts} />

      {/* D-Shot Glasses Promo */}
      <ShotGlassesPromo />

      {/* Music/Vinyl Promo */}
      <MusicPromo album={data.featuredAlbum} />

      {/* Tour Dates Preview */}
      <TourDatesPreview events={data.events} />

      {/* About Teaser */}
      <AboutTeaser />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter Signup */}
      <NewsletterSection />
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
        <p className="text-white uppercase tracking-[0.3em] mb-4 text-base font-semibold animate-fade-in">
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
    <section className="section bg-gray-50">
      <div className="container">
        <div className="section-header">
          <h2 className="text-3xl md:text-5xl font-display uppercase text-black mb-4">Shop the Collection</h2>
          <p className="text-lg text-black/60">Official Shot Caller Merchandise</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.handle}
              to={`/collections/${category.handle}`}
              className="group bg-white rounded-lg p-8 text-center hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              <category.icon className="w-10 h-10 mx-auto mb-4 text-merlot group-hover:text-merlot-dark transition-colors" />
              <h3 className="text-xl font-display uppercase text-black group-hover:text-merlot transition-colors">
                {category.title}
              </h3>
              <p className="text-black/60 text-base mt-2">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


function AboutTeaser() {
  return (
    <section className="section bg-gradient-to-r from-merlot/20 to-transparent">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-merlot uppercase tracking-widest text-sm font-semibold mb-4">
              Vallejo Legend
            </p>
            <h2 className="text-4xl md:text-5xl font-display uppercase text-white mb-6">
              D-Shot
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-4">
              <strong className="text-champagne">Danell LaShawn Stevens Sr.</strong>, known as D-Shot,
              is a pioneering rapper and entrepreneur from Vallejo, California. As a founding member
              of <strong className="text-white">The Click</strong> alongside his brother E-40,
              sister Suga-T, and cousin B-Legit, he helped define the Bay Area's legendary mobb music sound.
            </p>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              His debut album <em className="text-champagne">The Shot Calla</em> (1993) established him as a solo force.
              In 1995, he founded <strong className="text-white">Shot Records</strong>,
              building an independent empire that continues to influence West Coast hip-hop.
            </p>
            <Link to="/about" className="btn-secondary">
              Full Biography
            </Link>
          </div>
          <div className="aspect-square bg-dark-gray rounded-lg overflow-hidden">
            <img
              src="/dshot-bio.jpeg"
              alt="D-Shot - Vallejo Legend"
              className="w-full h-full object-cover object-top"
            />
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
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-display uppercase text-champagne mt-4 group-hover:scale-105 transition-transform origin-left">
                D.Shot
              </h2>
              <p className="text-5xl md:text-6xl lg:text-7xl font-display uppercase text-white mt-2">
                Shot Glasses
              </p>
              <p className="text-white/80 mt-6 text-xl">
                Premium luxury shot glasses. Elevate your drinking experience.
              </p>
              <span className="btn-primary mt-8 inline-block bg-champagne text-black hover:bg-white text-lg px-8 py-4">
                Shop Now
              </span>
            </div>

            {/* Right Image with Logo Behind */}
            <div className="relative h-full flex items-center justify-center p-8">
              {/* Logo Behind Glasses - Top Right */}
              <img
                src="/dshot-logo.png"
                alt=""
                className="absolute -top-8 -right-12 w-[500px] lg:w-[650px] opacity-80"
                style={{filter: 'brightness(0) invert(1) sepia(1) saturate(0.3) hue-rotate(350deg) brightness(1.3)'}}
              />
              {/* Shot Glasses */}
              <img
                src="/dshot-glasses-promo.png"
                alt="D-Shot Luxury Shot Glasses"
                className="relative z-10 max-h-[350px] w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

// Category tabs for New Arrivals section
const PRODUCT_TABS = [
  {id: 'new-arrivals', label: 'New Arrivals'},
  {id: 'apparel', label: 'Apparel'},
  {id: 'accessories', label: 'Accessories'},
  {id: 'shot-glasses', label: 'Shot Glasses'},
  {id: 'exclusives', label: 'Exclusives'},
];

interface CollectionProducts {
  'new-arrivals': any[];
  'apparel': any[];
  'accessories': any[];
  'shot-glasses': any[];
  'exclusives': any[];
}

// Color mapping for visual swatches on homepage
const COLOR_MAP: Record<string, string> = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Black/Gold': '#000000',
  'All Black': '#000000',
  'Navy': '#1a237e',
  'Burgundy': '#722F37',
  'Red': '#d32f2f',
  'Blue': '#1976d2',
  'Green': '#388e3c',
  'Gray': '#757575',
  'Grey': '#757575',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Maroon': '#800000',
  'Forest': '#228B22',
};

function getProductColorSwatches(product: any): {color: string; value: string}[] {
  const colorOption = product.variants?.nodes
    ?.flatMap((v: any) => v.selectedOptions)
    ?.filter((opt: any) => opt.name === 'Color' || opt.name === 'Style');

  if (!colorOption || colorOption.length === 0) return [];

  const uniqueColors = [...new Set(colorOption.map((opt: any) => opt.value))] as string[];
  return uniqueColors.map((value) => ({
    value,
    color: COLOR_MAP[value] || '#888888',
  }));
}

// New Arrivals Section with Tabs - White Background Merchandise Section
function NewArrivalsSection({collectionProducts}: {collectionProducts: CollectionProducts}) {
  const [activeTab, setActiveTab] = useState<keyof CollectionProducts>('new-arrivals');

  const products = collectionProducts[activeTab] || [];
  const activeTabLabel = PRODUCT_TABS.find(t => t.id === activeTab)?.label || 'New Arrivals';

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="section-header">
          <span className="badge-merlot mb-4">Shop Collection</span>
          <h2 className="text-3xl md:text-5xl font-display uppercase text-black mb-4">Featured Products</h2>
          <p className="text-lg text-black/60">Official Shot Caller Merchandise</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PRODUCT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as keyof CollectionProducts)}
              className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-merlot text-white'
                  : 'bg-gray-100 text-black/70 hover:bg-gray-200 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product: any) => {
              const colorSwatches = getProductColorSwatches(product);
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.handle}`}
                  className="group"
                >
                  <div className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
                    {product.featuredImage ? (
                      <Image
                        alt={product.featuredImage.altText || product.title}
                        data={product.featuredImage}
                        aspectRatio="1/1"
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display uppercase text-black text-base group-hover:text-merlot transition-colors truncate">
                    {product.title}
                  </h3>
                  <p className="text-merlot font-display mt-1">
                    <Money data={product.priceRange.minVariantPrice} />
                  </p>
                  {/* Color Swatches */}
                  {colorSwatches.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {colorSwatches.slice(0, 4).map((swatch, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{backgroundColor: swatch.color}}
                          title={swatch.value}
                        />
                      ))}
                      {colorSwatches.length > 4 && (
                        <span className="text-sm text-black/60 ml-1">
                          +{colorSwatches.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-black/60">No products in this collection yet.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to={`/collections/${activeTab}`} className="btn-primary">
            View All {activeTabLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

// Music/Vinyl Promo Section
interface FeaturedAlbum {
  title?: string;
  artist?: string;
  coverArtUrl?: string;
  spotify_link?: string;
  apple_music_link?: string;
}

function MusicPromo({album}: {album: FeaturedAlbum | null}) {
  // Use album cover from metaobject or fallback to static image
  const coverArtUrl = album?.coverArtUrl || '/dshot-album-cover.jpg';
  const albumTitle = album?.title || 'D-Shot Album';

  return (
    <section className="section bg-dark">
      <div className="container">
        <Link
          to="/collections/music"
          className="block rounded-xl overflow-hidden group relative bg-gradient-to-r from-black via-dark-gray to-black"
        >
          <div className="grid lg:grid-cols-2 items-center min-h-[350px]">
            {/* Left - Vinyl Image */}
            <div className="relative h-full flex items-center justify-center p-8 order-2 lg:order-1">
              <div className="relative">
                {/* Vinyl Record with Spin Animation */}
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-gray to-black border-4 border-gray/50 flex items-center justify-center animate-spin-slow group-hover:animate-spin-fast">
                  {/* Album Cover in Center */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
                    <img
                      src={coverArtUrl}
                      alt={albumTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Center hole */}
                  <div className="absolute w-6 h-6 rounded-full bg-black border-2 border-gray/50"></div>
                  {/* Grooves */}
                  <div className="absolute inset-8 rounded-full border border-white/10"></div>
                  <div className="absolute inset-12 rounded-full border border-white/5"></div>
                  <div className="absolute inset-16 rounded-full border border-white/10"></div>
                  <div className="absolute inset-20 rounded-full border border-white/5"></div>
                  {/* Vinyl shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="p-8 lg:p-12 relative z-10 order-1 lg:order-2">
              <span className="badge-champagne mb-4">Discography</span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display uppercase text-white mt-4 group-hover:text-champagne transition-colors">
                The Music
              </h2>
              <p className="text-2xl md:text-3xl font-display uppercase text-champagne mt-2">
                Vinyl & Digital
              </p>
              <p className="text-white/70 mt-6 text-lg max-w-md">
                13 albums spanning 1993–2024. CDs, vinyl, and exclusive releases. Own a piece of Bay Area hip-hop history.
              </p>
              <span className="btn-secondary mt-8 inline-block">
                Browse Music
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

// Tour Dates Preview
interface TourEvent {
  event_name?: string;
  date?: string;
  venue?: string;
  city?: string;
  ticket_link?: string;
}

function TourDatesPreview({events}: {events: TourEvent[]}) {
  // Filter for upcoming events (dates in the future)
  const upcomingEvents = events
    .filter((event) => {
      if (!event.date) return false;
      return new Date(event.date) >= new Date();
    })
    .slice(0, 3);

  return (
    <section className="section bg-gradient-to-b from-merlot/20 to-black">
      <div className="container">
        <div className="section-header">
          <span className="badge-champagne mb-4">On The Road</span>
          <h2 className="section-title">Tour Dates</h2>
          <p className="section-subtitle">Catch D-Shot live</p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-dark-gray rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray transition-colors"
              >
                <div className="flex items-center gap-6">
                  {/* Date */}
                  <div className="text-center min-w-[70px]">
                    <p className="text-3xl font-display text-champagne">
                      {event.date ? new Date(event.date).getDate() : '--'}
                    </p>
                    <p className="text-white/60 text-sm uppercase">
                      {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short' }) : '---'}
                    </p>
                  </div>
                  {/* Venue Info */}
                  <div>
                    <h3 className="font-display uppercase text-white text-lg">
                      {event.event_name || 'TBA'}
                    </h3>
                    <p className="text-white/60">
                      {event.venue} {event.city && `• ${event.city}`}
                    </p>
                  </div>
                </div>
                {/* Ticket Button */}
                {event.ticket_link ? (
                  <a
                    href={event.ticket_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm py-2 px-6"
                  >
                    Get Tickets
                  </a>
                ) : (
                  <span className="text-white/40 text-sm uppercase tracking-wider">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No upcoming shows scheduled</p>
            <p className="text-white/40 mt-2">Check back soon for new dates</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/tour" className="btn-outline">
            View All Tour Dates
          </Link>
        </div>
      </div>
    </section>
  );
}

// Instagram Feed Section
function InstagramFeed() {
  // Placeholder images - in production, would integrate with Instagram API
  const placeholderImages = [
    { id: 1, alt: 'D-Shot in studio' },
    { id: 2, alt: 'Live performance' },
    { id: 3, alt: 'Behind the scenes' },
    { id: 4, alt: 'Fan meetup' },
    { id: 5, alt: 'Album artwork' },
    { id: 6, alt: 'Merch preview' },
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="section-header">
          <span className="badge-merlot mb-4">@dshot</span>
          <h2 className="text-3xl md:text-5xl font-display uppercase text-black mb-4">Follow The Journey</h2>
          <p className="text-lg text-black/60">Behind the scenes on Instagram</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {placeholderImages.map((img) => (
            <a
              key={img.id}
              href="https://instagram.com/dshot"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden group relative"
            >
              {/* Placeholder - would be real Instagram images */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-merlot/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://instagram.com/dshot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-dark inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
            Follow @dshot
          </a>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <section className="section bg-gradient-to-r from-merlot to-merlot/80">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display uppercase text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get exclusive drops, tour announcements, and new music first. Join the D-Shot family.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-black/30 border border-white/20 rounded-md text-white placeholder:text-white/50 focus:border-champagne focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-champagne hover:bg-white text-black font-display uppercase tracking-wider rounded-md transition-all"
            >
              Subscribe
            </button>
          </form>

          <p className="text-white/50 text-sm mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

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

const EVENTS_QUERY = `#graphql
  query HomepageEvents {
    metaobjects(type: "event", first: 10) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }
` as const;

const HOMEPAGE_PRODUCT_FRAGMENT = `#graphql
  fragment HomepageProduct on Product {
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
    variants(first: 10) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

const HOMEPAGE_COLLECTIONS_QUERY = `#graphql
  ${HOMEPAGE_PRODUCT_FRAGMENT}
  query HomepageCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    newArrivals: collection(handle: "new-arrivals") {
      products(first: 8, sortKey: CREATED, reverse: true) {
        nodes {
          ...HomepageProduct
        }
      }
    }
    apparel: collection(handle: "apparel") {
      products(first: 8, sortKey: CREATED, reverse: true) {
        nodes {
          ...HomepageProduct
        }
      }
    }
    accessories: collection(handle: "accessories") {
      products(first: 8, sortKey: CREATED, reverse: true) {
        nodes {
          ...HomepageProduct
        }
      }
    }
    shotGlasses: collection(handle: "shot-glasses") {
      products(first: 8, sortKey: CREATED, reverse: true) {
        nodes {
          ...HomepageProduct
        }
      }
    }
    exclusives: collection(handle: "exclusives") {
      products(first: 8, sortKey: CREATED, reverse: true) {
        nodes {
          ...HomepageProduct
        }
      }
    }
  }
` as const;

const FEATURED_ALBUM_QUERY = `#graphql
  query FeaturedAlbum {
    metaobjects(type: "album_release", first: 10) {
      nodes {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
` as const;
