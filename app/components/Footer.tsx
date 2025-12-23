import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <NavLink to="/" className="footer-logo">
              <img src="/dshot-logo.png" alt="D-Shot Official" className="h-16" />
            </NavLink>
            <p className="text-white/60 mt-4 text-sm leading-relaxed">
              Bay Area Legend. Shot Caller Records.
              Official merchandise and music from D-Shot.
            </p>
            <div className="flex gap-4 mt-6">
              <SocialLink href="https://instagram.com/dshot" label="Instagram" icon="instagram" />
              <SocialLink href="https://twitter.com/dshot" label="Twitter" icon="twitter" />
              <SocialLink href="https://youtube.com/dshot" label="YouTube" icon="youtube" />
              <SocialLink href="https://spotify.com/artist/dshot" label="Spotify" icon="spotify" />
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="footer-heading">Shop</h4>
            <nav className="footer-links">
              <NavLink to="/collections/all">All Products</NavLink>
              <NavLink to="/collections/apparel">Apparel</NavLink>
              <NavLink to="/collections/music">Music</NavLink>
              <NavLink to="/collections/accessories">Accessories</NavLink>
              <NavLink to="/collections/exclusives">Exclusives</NavLink>
            </nav>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="footer-heading">Info</h4>
            <nav className="footer-links">
              <NavLink to="/about">About D-Shot</NavLink>
              <NavLink to="/tour">Tour Dates</NavLink>
              <NavLink to="/music">Discography</NavLink>
              <NavLink to="/blogs/news">News</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <Suspense>
              <Await resolve={footerPromise}>
                {(footer) => (
                  <nav className="footer-links">
                    {(footer?.menu || FALLBACK_FOOTER_MENU).items.map((item) => {
                      if (!item.url) return null;
                      const url =
                        item.url.includes('myshopify.com') ||
                        item.url.includes(publicStoreDomain) ||
                        item.url.includes(header.shop.primaryDomain.url)
                          ? new URL(item.url).pathname
                          : item.url;
                      const isExternal = !url.startsWith('/');
                      return isExternal ? (
                        <a
                          href={url}
                          key={item.id}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <NavLink key={item.id} prefetch="intent" to={url}>
                          {item.title}
                        </NavLink>
                      );
                    })}
                    <NavLink to="/account">My Account</NavLink>
                    <NavLink to="/cart">Cart</NavLink>
                  </nav>
                )}
              </Await>
            </Suspense>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray/30 mt-12 pt-12">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="footer-heading">Stay Connected</h4>
            <p className="text-white/60 mb-6">
              Get exclusive drops, tour updates, and new music first.
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} D-Shot / Shot Caller Records. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: 'instagram' | 'twitter' | 'youtube' | 'spotify';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-gray flex items-center justify-center text-white/60 hover:bg-merlot hover:text-white transition-all"
      aria-label={label}
    >
      {icon === 'instagram' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )}
      {icon === 'twitter' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )}
      {icon === 'youtube' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )}
      {icon === 'spotify' && (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )}
    </a>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
