import {Link} from 'react-router';
import type {Route} from './+types/about';
import {PageHero} from '~/components/PageHero';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'About D-Shot | Danell Stevens - Shot Records'},
    {
      name: 'description',
      content:
        'Danell LaShawn Stevens Sr. (D-Shot) - Vallejo rapper, founding member of The Click, brother of E-40, and CEO of Shot Records. Bay Area hip-hop legend since 1986.',
    },
  ];
};

export default function About() {
  return (
    <div className="about-page bg-white">
      <PageHero
        title="D-Shot"
        subtitle="Danell LaShawn Stevens Sr."
        label="Vallejo Legend"
      />

      {/* Bio Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden sticky top-24">
              <img
                src="/dshot-bio.jpeg"
                alt="D-Shot - Danell LaShawn Stevens Sr."
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="space-y-6 text-black/80 text-lg leading-relaxed">
              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-gray-100 rounded-lg mb-8">
                <div>
                  <p className="text-black/50 text-sm uppercase tracking-wider">Born</p>
                  <p className="text-merlot font-display text-xl">December 12, 1969</p>
                </div>
                <div>
                  <p className="text-black/50 text-sm uppercase tracking-wider">Origin</p>
                  <p className="text-merlot font-display text-xl">Vallejo, CA</p>
                </div>
                <div>
                  <p className="text-black/50 text-sm uppercase tracking-wider">Label</p>
                  <p className="text-merlot font-display text-xl">Shot Records</p>
                </div>
                <div>
                  <p className="text-black/50 text-sm uppercase tracking-wider">Active</p>
                  <p className="text-merlot font-display text-xl">1986 - Present</p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-script text-black mb-8">
                From Vallejo to the World
              </h2>
              <p>
                <strong className="text-merlot">Danell LaShawn Stevens Sr.</strong>, better known as
                D-Shot, is a pioneering American rapper and entrepreneur from Vallejo, California. Born on
                December 12, 1969, he emerged as a founding force in Bay Area hip-hop that would influence
                generations of artists.
              </p>
              <p>
                In 1986, D-Shot joined forces with his brother <strong className="text-black">Earl Stevens (E-40)</strong>,
                sister <strong className="text-black">Suga-T</strong>, and cousin <strong className="text-black">B-Legit</strong>
                to form <strong className="text-merlot">The Most Valuable Players</strong>, later known as
                <strong className="text-merlot"> The Click</strong>. The family group made their mark at a
                Grambling State University talent show and went on to become one of the most influential
                collectives in West Coast hip-hop history.
              </p>
              <p>
                After The Click released their debut album <em>Down and Dirty</em> through E-40's
                <strong className="text-black"> Sick Wid It Records</strong>, each member pursued solo careers.
                D-Shot's debut album, <strong className="text-merlot">The Shot Calla</strong> (1993),
                showcased his signature mobb music style and featured collaborations with his Click family members.
                The album charted on the Billboard Top R&B/Hip-Hop Albums chart and established him as a
                formidable solo artist.
              </p>
              <p>
                In 1995, D-Shot founded his own label, <strong className="text-merlot">Shot Records</strong>,
                demonstrating the entrepreneurial spirit that runs in the Stevens family. His second album,
                <em className="text-black"> Six Figures</em> (1997), was released through Shot Records in
                partnership with Jive Records. The album featured the single "True Worldwide Playa" with
                Too $hort and Spice 1, and "(I'll Be Yo') Huckleberry" from the Booty Call soundtrack.
              </p>

              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-display uppercase text-black mb-6">
                  Solo Discography
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="text-merlot">The Shot Calla</span>
                      <span className="text-black/40 text-sm ml-2">Sick Wid It Records</span>
                    </div>
                    <span className="text-black/50">1993</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="text-merlot">Six Figures</span>
                      <span className="text-black/40 text-sm ml-2">Shot Records / Jive</span>
                    </div>
                    <span className="text-black/50">1997</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="text-merlot">Money, Sex & Thugs</span>
                      <span className="text-black/40 text-sm ml-2">Shot Records</span>
                    </div>
                    <span className="text-black/50">2001</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="text-merlot">Bosses in the Booth</span>
                      <span className="text-black/40 text-sm ml-2">Shot Records</span>
                    </div>
                    <span className="text-black/50">2004</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="text-merlot">Callin All Shots</span>
                      <span className="text-black/40 text-sm ml-2">Shot Records</span>
                    </div>
                    <span className="text-black/50">2006</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <span className="text-merlot">Presidential</span>
                      <span className="text-black/40 text-sm ml-2">Shot Records</span>
                    </div>
                    <span className="text-black/50">2009</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-display uppercase text-black mb-6">
                  The Click Albums
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-merlot">Down and Dirty</span>
                    <span className="text-black/50">1992</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-merlot">Game Related</span>
                    <span className="text-black/50">1995</span>
                  </li>
                  <li className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-merlot">Money & Muscle</span>
                    <span className="text-black/50">2001</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Click Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-5xl md:text-6xl font-script text-black mb-6">
              The Click
            </h2>
            <p className="text-black/70 text-lg">
              A family affair that changed Bay Area hip-hop forever. The Click combined blood ties
              with lyrical prowess to create a sound that defined a generation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-merlot/20 mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-display uppercase text-merlot text-xl">E-40</h3>
              <p className="text-black/50 text-sm">Brother</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-merlot/20 mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-display uppercase text-merlot text-xl">D-Shot</h3>
              <p className="text-black/50 text-sm">Brother</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-merlot/20 mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-display uppercase text-merlot text-xl">Suga-T</h3>
              <p className="text-black/50 text-sm">Sister</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-merlot/20 mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-display uppercase text-merlot text-xl">B-Legit</h3>
              <p className="text-black/50 text-sm">Cousin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shot Records Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-merlot uppercase tracking-widest text-sm font-semibold mb-4">
              Est. 1995
            </p>
            <h2 className="text-5xl md:text-6xl font-script text-black mb-6">
              Shot Records
            </h2>
            <p className="text-black/70 text-lg mb-4">
              Founded by D-Shot in 1995, Shot Records exemplified the independent spirit of
              Bay Area hip-hop. By securing strategic distribution deals while retaining ownership,
              D-Shot built a model that influenced countless artists and labels.
            </p>
            <p className="text-black/70 text-lg mb-8">
              The label's approach allowed D-Shot to promote Bay Area artists beyond his own catalog,
              fostering a network that amplified mobb music's influence across the West Coast and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections/all" className="btn-primary">
                Shop Merch
              </Link>
              <Link to="/music" className="btn-outline-dark">
                Listen Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section bg-white">
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
