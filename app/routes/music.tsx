import {Link} from 'react-router';
import type {Route} from './+types/music';
import {PageHero} from '~/components/PageHero';

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

export default function Music() {
  return (
    <div className="music-page">
      <PageHero
        title="Music"
        subtitle="The Sound of the Bay"
        label="Discography"
      />

      {/* Streaming Links */}
      <section className="section bg-dark">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display uppercase text-white mb-4">
              Stream Now
            </h2>
            <p className="text-white/60">Available on all platforms</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <StreamingLink
              platform="Spotify"
              href="https://open.spotify.com/artist/dshot"
              color="bg-[#1DB954]"
            />
            <StreamingLink
              platform="Apple Music"
              href="https://music.apple.com/artist/dshot"
              color="bg-[#FA243C]"
            />
            <StreamingLink
              platform="YouTube Music"
              href="https://music.youtube.com/channel/dshot"
              color="bg-[#FF0000]"
            />
            <StreamingLink
              platform="Amazon Music"
              href="https://music.amazon.com/artists/dshot"
              color="bg-[#FF9900]"
            />
            <StreamingLink
              platform="Tidal"
              href="https://tidal.com/artist/dshot"
              color="bg-[#000000] border border-white/20"
            />
          </div>
        </div>
      </section>

      {/* Discography */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Discography</h2>
            <p className="section-subtitle">Solo albums and collaborations</p>
          </div>

          {/* Solo Albums */}
          <div className="mb-16">
            <h3 className="text-2xl font-display uppercase text-champagne mb-8">
              Solo Albums
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <AlbumCard
                title="Shot Caller"
                year="2001"
                type="Album"
              />
              <AlbumCard
                title="Six Figures"
                year="1997"
                type="Album"
              />
              <AlbumCard
                title="Down and Dirty"
                year="1995"
                type="Album"
              />
            </div>
          </div>

          {/* The Click */}
          <div className="mb-16">
            <h3 className="text-2xl font-display uppercase text-champagne mb-8">
              The Click
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <AlbumCard
                title="Money & Muscle"
                year="2001"
                type="The Click"
              />
              <AlbumCard
                title="Game Related"
                year="1995"
                type="The Click"
              />
              <AlbumCard
                title="Down and Dirty"
                year="1992"
                type="The Click"
              />
            </div>
          </div>

          {/* Features & Productions */}
          <div>
            <h3 className="text-2xl font-display uppercase text-champagne mb-8">
              Features & Productions
            </h3>
            <div className="bg-dark-gray rounded-lg p-6">
              <p className="text-white/70 text-center">
                D-Shot has produced and featured on countless tracks throughout his career.
                <br />
                Check streaming platforms for the complete catalog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Music Videos */}
      <section className="section bg-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Videos</h2>
            <p className="section-subtitle">Watch the latest visuals</p>
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
              className="btn-outline"
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Physical Music CTA */}
      <section className="section">
        <div className="container">
          <div className="bg-gradient-to-r from-merlot to-merlot-dark rounded-xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-display uppercase text-white mb-4">
                  Physical Copies
                </h2>
                <p className="text-white/80 mb-6">
                  Get vinyl records, CDs, and exclusive collector's editions
                  from the official Shot Caller store.
                </p>
                <Link to="/collections/music" className="btn-secondary">
                  Shop Music
                </Link>
              </div>
              <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center">
                <span className="text-6xl">💿</span>
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
}: {
  platform: string;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} text-white px-8 py-4 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity`}
    >
      {platform}
    </a>
  );
}

function AlbumCard({
  title,
  year,
  type,
}: {
  title: string;
  year: string;
  type: string;
}) {
  return (
    <div className="group bg-dark-gray rounded-lg overflow-hidden hover:bg-gray transition-colors">
      <div className="aspect-square bg-gray flex items-center justify-center">
        <span className="text-6xl text-white/20 group-hover:text-white/40 transition-colors">
          💿
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-merlot uppercase tracking-wider">{type}</p>
        <h4 className="text-lg font-display uppercase text-white mt-1 group-hover:text-champagne transition-colors">
          {title}
        </h4>
        <p className="text-white/50 text-sm mt-1">{year}</p>
      </div>
    </div>
  );
}

function VideoCard({title}: {title: string}) {
  return (
    <div className="group bg-dark-gray rounded-lg overflow-hidden cursor-pointer">
      <div className="aspect-video bg-gray flex items-center justify-center relative">
        <span className="text-5xl text-white/20">▶️</span>
        <div className="absolute inset-0 bg-merlot/0 group-hover:bg-merlot/20 transition-colors" />
      </div>
      <div className="p-4">
        <h4 className="text-lg font-display uppercase text-white group-hover:text-champagne transition-colors">
          {title}
        </h4>
      </div>
    </div>
  );
}
