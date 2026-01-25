import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/music';
import {PageHero} from '~/components/PageHero';
import {Image, Money} from '@shopify/hydrogen';
import {FaSpotify, FaApple, FaYoutube, FaAmazon} from 'react-icons/fa';
import {SiTidal} from 'react-icons/si';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Music | D-Shot - Shot Caller Records'},
    {
      name: 'description',
      content:
        'Stream and download music from D-Shot. Explore the complete discography from the Bay Area legend.',
    },
  ];
};

// Album handles for categorization
const SOLO_ALBUM_HANDLES = [
  'bagz-at-it',
  'ghetto',
  'presidential',
  'callin-all-shots',
  'bosses-in-the-booth',
  'money-sex-thugs',
  'six-figures',
  'the-shot-calla',
];

const THE_CLICK_HANDLES = [
  'money-and-muscle',
  'game-related',
  'down-and-dirty',
];

const COMPILATION_HANDLES = [
  'boss-players-vol-1',
  'amw-the-real-mobb',
];

// YouTube Videos from Shot Films Media Inc
// To add videos: Get the video ID from YouTube URL (the part after watch?v=)
// Example: https://www.youtube.com/watch?v=ABC123 → id is 'ABC123'
const YOUTUBE_VIDEOS = [
  { id: 'evzVBqHYUvo', title: 'D-Shot - Hot Water' },
  { id: 'UVS5pG9-xEw', title: 'D-Shot - Ask About Me ft Kokane, Juvenile' },
  { id: 'eNc0-dO-tKY', title: 'D-Shot Interview - Captain Save A Hoe Story' },
];

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  // Fetch all products from the music collection
  const {collection} = await storefront.query(MUSIC_COLLECTION_QUERY);

  const products = collection?.products?.nodes || [];

  // Categorize products by handle
  const soloAlbums = products.filter((p: any) => SOLO_ALBUM_HANDLES.includes(p.handle));
  const clickAlbums = products.filter((p: any) => THE_CLICK_HANDLES.includes(p.handle));
  const compilations = products.filter((p: any) => COMPILATION_HANDLES.includes(p.handle));

  // Sort by year (extracted from tags or description)
  const sortByYear = (a: any, b: any) => {
    const yearA = extractYear(a);
    const yearB = extractYear(b);
    return yearB - yearA; // Newest first
  };

  return {
    soloAlbums: soloAlbums.sort(sortByYear),
    clickAlbums: clickAlbums.sort(sortByYear),
    compilations: compilations.sort(sortByYear),
  };
}

// Extract year from product tags
function extractYear(product: any): number {
  const tags = product.tags || [];
  for (const tag of tags) {
    const year = parseInt(tag, 10);
    if (year >= 1990 && year <= 2030) {
      return year;
    }
  }
  return 2000;
}

export default function Music() {
  const {soloAlbums, clickAlbums, compilations} = useLoaderData<typeof loader>();
  const [activeVideo, setActiveVideo] = useState<{id: string; title: string} | null>(null);

  return (
    <div className="music-page bg-white">
      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          videoId={activeVideo.id}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
      <PageHero
        title="Music"
        subtitle="The Sound of the Bay"
        label="Discography"
      />

      {/* Streaming Links */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-script text-black mb-4">
              Stream Now
            </h2>
            <p className="text-black/60">Available on all platforms</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <StreamingLink
              platform="Spotify"
              href="https://open.spotify.com/artist/dshot"
              color="bg-[#1DB954]"
              icon={<FaSpotify className="w-6 h-6" />}
            />
            <StreamingLink
              platform="Apple Music"
              href="https://music.apple.com/artist/dshot"
              color="bg-[#FA243C]"
              icon={<FaApple className="w-6 h-6" />}
            />
            <StreamingLink
              platform="YouTube Music"
              href="https://music.youtube.com/channel/dshot"
              color="bg-[#FF0000]"
              icon={<FaYoutube className="w-6 h-6" />}
            />
            <StreamingLink
              platform="Amazon Music"
              href="https://music.amazon.com/artists/dshot"
              color="bg-[#FF9900]"
              icon={<FaAmazon className="w-6 h-6" />}
            />
            <StreamingLink
              platform="Tidal"
              href="https://tidal.com/artist/dshot"
              color="bg-[#000000]"
              icon={<SiTidal className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Discography */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-script text-black mb-4">Discography</h2>
            <p className="text-lg text-black/60">13 Albums • 1993–2024</p>
          </div>

          {/* Solo Albums */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display uppercase text-merlot">
                Solo Albums
              </h3>
              <span className="text-black/50 text-sm">{soloAlbums.length} albums</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {soloAlbums.map((album: any) => (
                <AlbumCard
                  key={album.id}
                  product={album}
                  type="Solo Album"
                />
              ))}
            </div>
          </div>

          {/* The Click */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display uppercase text-merlot">
                The Click
              </h3>
              <span className="text-black/50 text-sm">{clickAlbums.length} albums</span>
            </div>
            <p className="text-black/60 mb-6 -mt-4">with E-40, Suga-T & B-Legit</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clickAlbums.map((album: any) => (
                <AlbumCard
                  key={album.id}
                  product={album}
                  type="The Click"
                />
              ))}
            </div>
          </div>

          {/* Compilation Albums */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display uppercase text-merlot">
                Compilations & Presented
              </h3>
              <span className="text-black/50 text-sm">{compilations.length} albums</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {compilations.map((album: any) => (
                <AlbumCard
                  key={album.id}
                  product={album}
                  type="Compilation"
                />
              ))}
            </div>
          </div>

          {/* Features & Productions */}
          <div>
            <h3 className="text-2xl font-display uppercase text-merlot mb-8">
              Features & Productions
            </h3>
            <div className="bg-gray-100 rounded-lg p-6">
              <p className="text-black/70 text-center">
                D-Shot has produced and featured on countless tracks throughout his career.
                <br />
                Check streaming platforms for the complete catalog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Music Videos */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-header">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-script text-black mb-4">Videos</h2>
            <p className="text-lg text-black/60">Watch the latest visuals</p>
          </div>

          {YOUTUBE_VIDEOS.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {YOUTUBE_VIDEOS.map((video, index) => (
                <YouTubeThumbnail
                  key={`${video.id}-${index}`}
                  videoId={video.id}
                  title={video.title}
                  onClick={() => setActiveVideo(video)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <a
                href="https://www.youtube.com/@shotfilmsmediainc.6377"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl p-8 hover:bg-gray-100 transition-colors max-w-2xl mx-auto"
              >
                <FaYoutube className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-display uppercase text-black mb-2">Watch on YouTube</h3>
                <p className="text-black/60">Check out the latest videos from Shot Films Media</p>
              </a>
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com/@shotfilmsmediainc.6377"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-dark inline-flex items-center gap-2"
            >
              <FaYoutube className="w-5 h-5" />
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Physical Music CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="bg-gradient-to-r from-merlot to-merlot-dark rounded-xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="badge-champagne mb-4">Hard Copies Available</span>
                <h2 className="text-5xl md:text-7xl font-script text-white mb-4 mt-4">
                  Own the Collection
                </h2>
                <p className="text-white/80 mb-4 text-lg">
                  Get CDs, vinyl records, and exclusive collector's editions of all 13 albums
                  from the official Shot Records store.
                </p>
                <div className="flex flex-wrap gap-3 mb-6 text-white/60 text-sm">
                  <span>✓ 8 Solo Albums</span>
                  <span>✓ 3 Click Albums</span>
                  <span>✓ 2 Compilations</span>
                </div>
                <Link to="/collections/music" className="btn-secondary text-lg px-8 py-4">
                  Shop All Music
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {soloAlbums.slice(0, 3).map((album: any) => (
                  <div key={album.id} className="aspect-square bg-black/30 rounded-lg overflow-hidden">
                    {album.featuredImage ? (
                      <Image
                        data={album.featuredImage}
                        aspectRatio="1/1"
                        sizes="150px"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">💿</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StreamingLink({
  platform,
  href,
  color,
  icon,
}: {
  platform: string;
  href: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} text-white px-6 py-4 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-3`}
    >
      {icon}
      {platform}
    </a>
  );
}


function AlbumCard({
  product,
  type,
}: {
  product: any;
  type: string;
}) {
  const year = extractYear(product);

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group bg-gray-100 rounded-lg overflow-hidden hover:bg-gray-200 transition-colors block"
    >
      <div className="aspect-square bg-gray-200 flex items-center justify-center relative overflow-hidden">
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl text-gray-300 group-hover:text-gray-400 transition-colors">
            💿
          </span>
        )}
        {/* Hover overlay with Buy button */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-champagne text-black px-6 py-3 rounded-md font-display uppercase text-sm">
            Buy CD
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-merlot uppercase tracking-wider">{type}</p>
        <h4 className="text-lg font-display uppercase text-black mt-1 group-hover:text-merlot transition-colors line-clamp-2">
          {product.title}
        </h4>
        <div className="flex items-center justify-between mt-2">
          <p className="text-black/50 text-sm">{year}</p>
          <p className="text-merlot font-display">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        </div>
      </div>
    </Link>
  );
}

function YouTubeThumbnail({
  videoId,
  title,
  onClick,
}: {
  videoId: string;
  title: string;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  // Try different thumbnail sources
  const thumbnailUrls = [
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/0.jpg`,
  ];

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm text-left w-full group cursor-pointer"
    >
      <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-black">
        {/* YouTube Thumbnail with fallback */}
        {!imgError ? (
          <img
            src={thumbnailUrls[0]}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaYoutube className="w-20 h-20 text-red-600" />
          </div>
        )}
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* YouTube Badge */}
        <div className="absolute top-3 left-3 bg-black/50 rounded px-2 py-1">
          <FaYoutube className="w-6 h-6 text-red-600" />
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-lg font-display uppercase text-black group-hover:text-merlot transition-colors">
          {title}
        </h4>
      </div>
    </button>
  );
}

function VideoModal({
  videoId,
  title,
  onClose,
}: {
  videoId: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-champagne transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Title */}
        <h3 className="text-white text-xl font-display uppercase mb-4">{title}</h3>

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

const MUSIC_COLLECTION_QUERY = `#graphql
  query MusicCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "music") {
      id
      title
      products(first: 50) {
        nodes {
          id
          title
          handle
          tags
          featuredImage {
            id
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;
