import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/music';
import {PageHero} from '~/components/PageHero';
import {Image, Money} from '@shopify/hydrogen';

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

  return (
    <div className="music-page bg-white">
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
              icon={<SpotifyIcon />}
            />
            <StreamingLink
              platform="Apple Music"
              href="https://music.apple.com/artist/dshot"
              color="bg-[#FA243C]"
              icon={<AppleMusicIcon />}
            />
            <StreamingLink
              platform="YouTube Music"
              href="https://music.youtube.com/channel/dshot"
              color="bg-[#FF0000]"
              icon={<YouTubeMusicIcon />}
            />
            <StreamingLink
              platform="Amazon Music"
              href="https://music.amazon.com/artists/dshot"
              color="bg-[#FF9900]"
              icon={<AmazonMusicIcon />}
            />
            <StreamingLink
              platform="Tidal"
              href="https://tidal.com/artist/dshot"
              color="bg-[#000000]"
              icon={<TidalIcon />}
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <VideoCard title="Latest Music Video" />
            <VideoCard title="Behind the Scenes" />
            <VideoCard title="Studio Session" />
          </div>

          <div className="text-center mt-12">
            <a
              href="https://youtube.com/@dshot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-dark"
            >
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

// Streaming platform icons
const SpotifyIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.228-2.403-.96-.63-.767-.7-1.76-.185-2.6.517-.843 1.32-1.24 2.28-1.32.46-.038.922-.008 1.345.15.18.067.313.063.313-.18V7.896c0-.17-.057-.3-.224-.337-.17-.038-.34-.08-.51-.124l-3.93-.972c-.258-.063-.515-.128-.772-.195-.18-.048-.28.02-.296.2-.006.06-.003.12-.003.18v8.167c0 .39-.047.773-.21 1.133-.326.716-.88 1.164-1.624 1.384-.38.112-.77.167-1.168.182-.977.037-1.857-.2-2.503-.96-.726-.853-.733-2.04-.03-2.893.47-.572 1.09-.903 1.82-1.023.65-.108 1.29-.053 1.9.21.18.077.307.053.307-.173V5.127c0-.208.08-.328.288-.372l5.726-1.417c.16-.04.322-.073.484-.108.218-.047.328.03.348.257.003.04.003.08.003.12v6.508z"/>
  </svg>
);

const YouTubeMusicIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
);

const AmazonMusicIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.439-2.186 1.439-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.684zm3.186 7.705a.66.66 0 01-.753.075c-1.06-.879-1.25-1.288-1.834-2.127-1.753 1.788-2.994 2.322-5.268 2.322-2.69 0-4.789-1.66-4.789-4.981 0-2.595 1.406-4.361 3.406-5.221 1.731-.756 4.149-.891 5.996-1.099v-.412c0-.756.058-1.648-.386-2.301-.385-.578-1.124-.818-1.775-.818-1.205 0-2.278.618-2.54 1.899-.054.285-.262.566-.549.58l-3.063-.33c-.259-.058-.548-.266-.473-.66C6.036 1.724 9.004 0 11.622 0c1.34 0 3.09.356 4.145 1.372 1.34 1.246 1.213 2.908 1.213 4.718v4.272c0 1.285.533 1.85 1.033 2.544.177.249.216.548-.009.733-.56.467-1.555 1.333-2.1 1.817l-.76-.661zM21.779 21.04c-1.591 1.18-3.89 1.8-5.86 1.8-2.77 0-5.272-1.02-7.16-2.73-.15-.13-.01-.32.16-.21 2.04 1.18 4.56 1.9 7.16 1.9 1.76 0 3.69-.37 5.47-1.13.27-.12.5.18.23.37zM22.85 19.71c-.2-.26-1.32-.12-1.82-.06-.15.02-.17-.11-.04-.21.89-.63 2.36-.45 2.53-.24.17.21-.04 1.68-.88 2.38-.13.11-.25.05-.19-.09.19-.46.6-1.52.4-1.78z"/>
  </svg>
);

const TidalIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l4.004-4.004L20.02 12l4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004zM12.012 12.004L8.008 16.008l4.004 4.004 4.004-4.004-4.004-4.004z"/>
  </svg>
);

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

function VideoCard({title}: {title: string}) {
  return (
    <div className="group bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
      <div className="aspect-video bg-gray-200 flex items-center justify-center relative">
        <span className="text-5xl text-gray-400">▶️</span>
        <div className="absolute inset-0 bg-merlot/0 group-hover:bg-merlot/20 transition-colors" />
      </div>
      <div className="p-4">
        <h4 className="text-lg font-display uppercase text-black group-hover:text-merlot transition-colors">
          {title}
        </h4>
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
