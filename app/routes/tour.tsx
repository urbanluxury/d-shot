import {Link, useLoaderData} from 'react-router';
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

interface EventFields {
  date?: string;
  venue?: string;
  city?: string;
  ticket_url?: string;
  status?: string;
}

interface Event {
  id: string;
  date: string;
  year: string;
  venue: string;
  city: string;
  ticketUrl: string;
  status: string;
}

export async function loader({context}: Route.LoaderArgs) {
  const {metaobjects} = await context.storefront.query(EVENTS_QUERY);

  // Transform metaobject data into usable format
  const events: Event[] =
    metaobjects?.nodes?.map(
      (node: {id: string; fields: {key: string; value?: string | null}[]}) => {
        const fields = node.fields.reduce(
          (acc: EventFields, field: {key: string; value?: string | null}) => {
            acc[field.key as keyof EventFields] = field.value || '';
            return acc;
          },
          {} as EventFields,
        );

        // Parse date string to extract month/day and year
        const dateObj = fields.date ? new Date(fields.date) : new Date();
        const monthDay = dateObj
          .toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
          .toUpperCase();
        const year = dateObj.getFullYear().toString();

        return {
          id: node.id,
          date: monthDay,
          year: year,
          venue: fields.venue || 'TBA',
          city: fields.city || 'TBA',
          ticketUrl: fields.ticket_url || '#',
          status: fields.status || 'on-sale',
        };
      },
    ) || [];

  return {events};
}

export default function Tour() {
  const {events} = useLoaderData<typeof loader>();

  // Use fetched events or fallback to sample data if none exist
  const upcomingShows =
    events.length > 0
      ? events
      : [
          {
            id: '1',
            date: 'JAN 15',
            year: '2025',
            venue: 'The Fillmore',
            city: 'San Francisco, CA',
            ticketUrl: '#',
            status: 'on-sale',
          },
          {
            id: '2',
            date: 'JAN 22',
            year: '2025',
            venue: 'Fox Theater',
            city: 'Oakland, CA',
            ticketUrl: '#',
            status: 'on-sale',
          },
        ];

  return (
    <div className="tour-page bg-white">
      <PageHero
        title="Tour"
        subtitle="Catch D-Shot Live"
        label="Live Shows"
      />

      {/* Upcoming Shows */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header">
            <h2 className="text-4xl md:text-6xl font-script text-black mb-4">Upcoming Shows</h2>
            <p className="text-lg text-black/60">Don't miss out</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {upcomingShows.map((show) => (
              <div
                key={show.id}
                className="bg-gray-100 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-200 transition-colors"
              >
                {/* Date */}
                <div className="text-center md:text-left md:w-24">
                  <p className="text-2xl font-display uppercase text-merlot">
                    {show.date}
                  </p>
                  <p className="text-black/50 text-sm">{show.year}</p>
                </div>

                {/* Venue Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-display uppercase text-black">
                    {show.venue}
                  </h3>
                  <p className="text-black/60">{show.city}</p>
                </div>

                {/* Ticket Button */}
                <div>
                  {show.status === 'sold-out' ? (
                    <span className="badge bg-gray-300 text-black/50">Sold Out</span>
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
              <p className="text-black/60 text-lg">
                No upcoming shows at this time. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* VIP Experience */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="bg-gradient-to-r from-merlot/10 to-merlot/20 rounded-xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="badge-merlot mb-4">Exclusive</span>
                <h2 className="text-3xl md:text-4xl font-display uppercase text-black mt-4 mb-4">
                  VIP Experience
                </h2>
                <p className="text-black/70 mb-6">
                  Get the ultimate D-Shot experience with VIP packages.
                  Includes meet & greet, exclusive merch, early entry, and more.
                </p>
                <ul className="space-y-2 text-black/80 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-merlot">✓</span> Meet & Greet with D-Shot
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-merlot">✓</span> Exclusive VIP Merchandise
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-merlot">✓</span> Early Venue Access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-merlot">✓</span> Photo Opportunity
                  </li>
                </ul>
                <Link to="/collections/vip-packages" className="btn-primary">
                  View VIP Packages
                </Link>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🎤</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Notify */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display uppercase text-black mb-4">
              Get Notified
            </h2>
            <p className="text-black/60 mb-8">
              Be the first to know when new shows are announced in your area.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-100 border border-gray-300 rounded px-4 py-3 text-black placeholder-black/40 focus:border-merlot focus:ring-1 focus:ring-merlot transition-colors"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section bg-white">
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

const EVENTS_QUERY = `#graphql
  query Events {
    metaobjects(type: "event", first: 20, sortKey: "date") {
      nodes {
        id
        fields {
          key
          value
        }
      }
    }
  }
` as const;
