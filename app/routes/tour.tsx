import {Link} from 'react-router';
import type {Route} from './+types/tour';
import {PageHero} from '~/components/PageHero';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Tour Dates | D-Shot - Shot Caller Records'},
    {
      name: 'description',
      content:
        'See D-Shot live. Check upcoming tour dates, buy tickets, and find shows near you.',
    },
  ];
};

export default function Tour() {
  // Sample tour dates - in production these would come from a CMS or API
  const upcomingShows = [
    {
      id: 1,
      date: 'JAN 15',
      year: '2025',
      venue: 'The Fillmore',
      city: 'San Francisco, CA',
      ticketUrl: '#',
      status: 'on-sale',
    },
    {
      id: 2,
      date: 'JAN 22',
      year: '2025',
      venue: 'Fox Theater',
      city: 'Oakland, CA',
      ticketUrl: '#',
      status: 'on-sale',
    },
    {
      id: 3,
      date: 'FEB 5',
      year: '2025',
      venue: 'The Warfield',
      city: 'San Francisco, CA',
      ticketUrl: '#',
      status: 'low-tickets',
    },
    {
      id: 4,
      date: 'FEB 14',
      year: '2025',
      venue: 'House of Blues',
      city: 'Los Angeles, CA',
      ticketUrl: '#',
      status: 'on-sale',
    },
    {
      id: 5,
      date: 'MAR 1',
      year: '2025',
      venue: 'The Regency Ballroom',
      city: 'San Francisco, CA',
      ticketUrl: '#',
      status: 'sold-out',
    },
  ];

  return (
    <div className="tour-page">
      <PageHero
        title="Tour"
        subtitle="Catch D-Shot Live"
        label="Live Shows"
      />

      {/* Upcoming Shows */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Shows</h2>
            <p className="section-subtitle">Don't miss out</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {upcomingShows.map((show) => (
              <div
                key={show.id}
                className="bg-dark-gray rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray transition-colors"
              >
                {/* Date */}
                <div className="text-center md:text-left md:w-24">
                  <p className="text-2xl font-display uppercase text-champagne">
                    {show.date}
                  </p>
                  <p className="text-white/50 text-sm">{show.year}</p>
                </div>

                {/* Venue Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-display uppercase text-white">
                    {show.venue}
                  </h3>
                  <p className="text-white/60">{show.city}</p>
                </div>

                {/* Ticket Button */}
                <div>
                  {show.status === 'sold-out' ? (
                    <span className="badge bg-gray text-white/50">Sold Out</span>
                  ) : (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-primary ${
                        show.status === 'low-tickets' ? 'bg-orange-600 hover:bg-orange-700' : ''
                      }`}
                    >
                      {show.status === 'low-tickets' ? 'Low Tickets' : 'Get Tickets'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {upcomingShows.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg">
                No upcoming shows at this time. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* VIP Experience */}
      <section className="section bg-dark">
        <div className="container">
          <div className="bg-gradient-to-r from-champagne/10 to-merlot/20 rounded-xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="badge-champagne mb-4">Exclusive</span>
                <h2 className="text-3xl md:text-4xl font-display uppercase text-white mt-4 mb-4">
                  VIP Experience
                </h2>
                <p className="text-white/70 mb-6">
                  Get the ultimate D-Shot experience with VIP packages.
                  Includes meet & greet, exclusive merch, early entry, and more.
                </p>
                <ul className="space-y-2 text-white/80 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-champagne">✓</span> Meet & Greet with D-Shot
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-champagne">✓</span> Exclusive VIP Merchandise
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-champagne">✓</span> Early Venue Access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-champagne">✓</span> Photo Opportunity
                  </li>
                </ul>
                <Link to="/collections/vip-packages" className="btn-secondary">
                  View VIP Packages
                </Link>
              </div>
              <div className="aspect-video bg-dark-gray rounded-lg flex items-center justify-center">
                <span className="text-6xl">🎤</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Notify */}
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display uppercase text-white mb-4">
              Get Notified
            </h2>
            <p className="text-white/60 mb-8">
              Be the first to know when new shows are announced in your area.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section bg-dark">
        <div className="container">
          <div className="bg-merlot rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-display uppercase text-white mb-4">
              Book D-Shot
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              For booking inquiries, festivals, private events, and collaborations,
              contact the management team.
            </p>
            <Link to="/contact" className="btn-secondary">
              Contact for Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
