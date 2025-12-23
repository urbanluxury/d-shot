import {Link} from 'react-router';
import type {Route} from './+types/about';
import {PageHero} from '~/components/PageHero';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'About D-Shot | Shot Caller Records'},
    {
      name: 'description',
      content:
        'Learn about D-Shot, Bay Area hip-hop legend and CEO of Shot Caller Records. From Vallejo to the world.',
    },
  ];
};

export default function About() {
  return (
    <div className="about-page">
      <PageHero
        title="D-Shot"
        subtitle="Bay Area Icon. Producer. CEO. Shot Caller."
        label="The Legend"
      />

      {/* Bio Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="aspect-[3/4] bg-dark-gray rounded-lg overflow-hidden sticky top-24">
              {/* Placeholder for D-Shot photo */}
              <div className="w-full h-full flex items-center justify-center text-white/20 text-8xl">
                📷
              </div>
            </div>
            <div className="space-y-6 text-white/80 text-lg leading-relaxed">
              <h2 className="text-3xl font-display uppercase text-white mb-8">
                From the Bay to the World
              </h2>
              <p>
                D-Shot, born and raised in Vallejo, California, is one of the most
                influential figures in Bay Area hip-hop history. As a founding member
                of the legendary group <strong className="text-champagne">The Click</strong>,
                alongside his brother E-40, B-Legit, and Suga-T, he helped create the
                blueprint for independent hip-hop success.
              </p>
              <p>
                With a career spanning over three decades, D-Shot has been instrumental
                in shaping the sound and business of West Coast rap. As CEO of
                <strong className="text-champagne"> Shot Caller Records</strong>, he
                continues to push boundaries and develop new talent while maintaining
                his status as one of the game's most respected veterans.
              </p>
              <p>
                His production credits read like a who's who of Bay Area royalty,
                and his business acumen has made him a model for artist entrepreneurship.
                From the hyphy movement to today's new generation of Bay Area artists,
                D-Shot's influence can be heard and felt throughout the culture.
              </p>

              <div className="pt-8 border-t border-gray">
                <h3 className="text-2xl font-display uppercase text-white mb-6">
                  Discography Highlights
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center py-3 border-b border-gray/50">
                    <span className="text-champagne">Down and Dirty</span>
                    <span className="text-white/50">1995</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray/50">
                    <span className="text-champagne">Six Figures</span>
                    <span className="text-white/50">1997</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray/50">
                    <span className="text-champagne">Shot Caller</span>
                    <span className="text-white/50">2001</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray/50">
                    <span className="text-champagne">The Click - Game Related</span>
                    <span className="text-white/50">1995</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray/50">
                    <span className="text-champagne">The Click - Money & Muscle</span>
                    <span className="text-white/50">2001</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shot Caller Records Section */}
      <section className="section bg-dark">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-display uppercase text-white mb-6">
              Shot Caller Records
            </h2>
            <p className="text-white/70 text-lg mb-8">
              More than a label, Shot Caller Records is a movement. Founded by D-Shot,
              the label represents the next generation of Bay Area excellence while
              honoring the legacy that came before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections/all" className="btn-primary">
                Shop Merch
              </Link>
              <Link to="/music" className="btn-outline">
                Listen Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section">
        <div className="container">
          <div className="bg-gradient-to-r from-merlot to-merlot-dark rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-display uppercase text-white mb-4">
              Booking & Inquiries
            </h2>
            <p className="text-white/80 mb-6">
              For press, booking, and business inquiries, get in touch with the team.
            </p>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
