import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue, Link} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <div className="header-inner">
        {/* Mobile Menu Toggle */}
        <HeaderMenuMobileToggle />

        {/* Logo */}
        <NavLink prefetch="intent" to="/" className="header-logo" end>
          <img src="/dshot-logo.png" alt="D-Shot Official" className="h-10" />
        </NavLink>

        {/* Desktop Navigation */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* CTAs */}
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

// Shop dropdown categories
const SHOP_CATEGORIES = [
  {title: 'All Products', handle: 'all'},
  {title: 'Apparel', handle: 'apparel'},
  {title: 'Music', handle: 'music'},
  {title: 'Accessories', handle: 'accessories'},
  {title: 'Shot Glasses', handle: 'shot-glasses'},
  {title: 'Exclusives', handle: 'exclusives'},
  {title: 'New Arrivals', handle: 'new-arrivals'},
];

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = viewport === 'desktop' ? 'header-nav' : 'header-menu-mobile';
  const {close} = useAside();
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className="nav-link"
          to="/"
        >
          Home
        </NavLink>
      )}
      {/* Custom navigation for D-Shot */}
      {MAIN_MENU.map((item) => {
        // Shop item with dropdown (desktop only)
        if (item.id === 'shop' && viewport === 'desktop') {
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <NavLink
                prefetch="intent"
                className={({isActive}) =>
                  `nav-link inline-flex items-center gap-1 ${isActive ? 'text-champagne' : ''}`
                }
                to={item.url}
              >
                {item.title}
                <svg
                  className={`w-4 h-4 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </NavLink>
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-48 bg-dark-gray rounded-lg shadow-xl border border-white/10 overflow-hidden transition-all duration-200 ${
                  shopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                {SHOP_CATEGORIES.map((category) => (
                  <Link
                    key={category.handle}
                    to={`/collections/${category.handle}`}
                    className="block px-4 py-3 text-white/80 hover:text-champagne hover:bg-white/5 transition-colors text-sm"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        }

        // Mobile: Show Shop with expandable categories
        if (item.id === 'shop' && viewport === 'mobile') {
          return (
            <div key={item.id} className="space-y-2">
              <NavLink
                onClick={close}
                prefetch="intent"
                className={({isActive}) =>
                  `nav-link ${isActive ? 'text-champagne' : ''}`
                }
                to={item.url}
              >
                {item.title}
              </NavLink>
              <div className="pl-4 space-y-2 border-l border-white/20">
                {SHOP_CATEGORIES.map((category) => (
                  <Link
                    key={category.handle}
                    to={`/collections/${category.handle}`}
                    onClick={close}
                    className="block text-white/60 hover:text-champagne transition-colors text-sm py-1"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        }

        // Regular menu items
        return (
          <NavLink
            key={item.id}
            end={item.url === '/'}
            onClick={close}
            prefetch="intent"
            className={({isActive}) =>
              `nav-link ${isActive ? 'text-champagne' : ''}`
            }
            to={item.url}
          >
            {item.title}
          </NavLink>
        );
      })}
      {/* Dynamic Shopify menu items */}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const pathname = new URL(item.url).pathname;

        // Skip items that duplicate our custom menu (check both exact match and /pages/ variants)
        const isDuplicate = MAIN_MENU.some(m => {
          const menuPath = m.url;
          return pathname === menuPath ||
                 pathname === `/pages${menuPath}` ||
                 pathname === menuPath.replace('/', '/pages/') ||
                 item.title.toLowerCase() === m.title.toLowerCase();
        });
        if (isDuplicate) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? pathname
            : item.url;
        return (
          <NavLink
            key={item.id}
            end
            onClick={close}
            prefetch="intent"
            className={({isActive}) =>
              `nav-link ${isActive ? 'text-champagne' : ''}`
            }
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) =>
          `header-icon ${isActive ? 'text-champagne' : 'text-white/80 hover:text-champagne'}`
        }
        title="Account"
      >
        <Suspense fallback={<UserIcon />}>
          <Await resolve={isLoggedIn} errorElement={<UserIcon />}>
            {(isLoggedIn) => <UserIcon filled={isLoggedIn} />}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-mobile-toggle lg:hidden text-white p-2 hover:text-champagne transition-colors"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-icon text-white/80 hover:text-champagne transition-colors"
      onClick={() => open('search')}
      aria-label="Search"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </button>
  );
}

function UserIcon({filled = false}: {filled?: boolean}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="header-icon text-white/80 hover:text-champagne transition-colors relative"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label="Cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-merlot text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// Custom D-Shot main menu
const MAIN_MENU = [
  {id: 'shop', title: 'Shop', url: '/collections/all'},
  {id: 'music', title: 'Music', url: '/music'},
  {id: 'tour', title: 'Tour', url: '/tour'},
  {id: 'about', title: 'About', url: '/about'},
  {id: 'news', title: 'News', url: '/blogs/news'},
  {id: 'contact', title: 'Contact', url: '/contact'},
];

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
  ],
};
