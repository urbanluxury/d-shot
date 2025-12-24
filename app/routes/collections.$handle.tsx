import {useState} from 'react';
import {redirect, useLoaderData, Link, useParams, useSearchParams, useNavigate} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Image, Money} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PageHero} from '~/components/PageHero';
import {ProductFilters, extractFiltersFromProducts, filterProducts} from '~/components/ProductFilters';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `D-Shot | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 50, // Load more for client-side filtering
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const {handle} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract filter options from products
  const allProducts = collection.products.nodes;
  const filters = extractFiltersFromProducts(allProducts);

  // Apply client-side filtering
  const filteredProducts = filterProducts(allProducts, searchParams);

  // Get current sort
  const currentSort = searchParams.get('sort') || 'featured';

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (currentSort) {
      case 'price-asc':
        return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      case 'price-desc':
        return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Handle sort change
  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort === 'featured') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', sort);
    }
    navigate(`?${newParams.toString()}`, {replace: true});
  };

  return (
    <div className="collection bg-black min-h-screen">
      <PageHero
        title={collection.title}
        subtitle={collection.description}
        label="Collection"
      />

      <div className="container py-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-gray rounded-lg text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-dark-gray border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:border-champagne focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Name: A-Z</option>
            <option value="title-desc">Name: Z-A</option>
          </select>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-dark-gray overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display uppercase text-white">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Category Links */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Categories</h4>
                  <nav className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.handle}
                        to={`/collections/${cat.handle}`}
                        onClick={() => setMobileFiltersOpen(false)}
                        className={`block transition-colors ${
                          handle === cat.handle
                            ? 'text-champagne font-medium'
                            : 'text-white/80 hover:text-champagne'
                        }`}
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </nav>
                </div>

                <ProductFilters
                  filters={filters}
                  productCount={sortedProducts.length}
                />
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar - 25% width - Always visible on lg screens */}
          <aside className="hidden lg:block">
            <div className="bg-dark-gray rounded-lg p-6 sticky top-24">
              {/* Category Links */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Categories</h4>
                <nav className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.handle}
                      to={`/collections/${cat.handle}`}
                      className={`block transition-colors ${
                        handle === cat.handle
                          ? 'text-champagne font-medium'
                          : 'text-white/80 hover:text-champagne'
                      }`}
                    >
                      {cat.title}
                    </Link>
                  ))}
                </nav>
              </div>

              <ProductFilters
                filters={filters}
                productCount={sortedProducts.length}
              />
            </div>
          </aside>

          {/* Product Grid - 75% width */}
          <div className="lg:col-span-3">
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-white/60">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
              </p>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-dark-gray border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:border-champagne focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A-Z</option>
                <option value="title-desc">Name: Z-A</option>
              </select>
            </div>

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sortedProducts.map((product: any, index: number) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    loading={index < 8 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-white/60 text-lg mb-4">No products match your filters</p>
                <button
                  onClick={() => navigate(`/collections/${handle}`)}
                  className="text-champagne hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function ProductCard({product, loading}: {product: any; loading: 'eager' | 'lazy'}) {
  return (
    <Link to={`/products/${product.handle}`} className="group">
      <div className="aspect-square bg-dark-gray rounded-lg overflow-hidden mb-3">
        {product.featuredImage ? (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading={loading}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="font-display uppercase text-white text-sm group-hover:text-champagne transition-colors line-clamp-2">
        {product.title}
      </h3>
      <p className="text-champagne font-display mt-1">
        <Money data={product.priceRange.minVariantPrice} />
      </p>
    </Link>
  );
}

const CATEGORIES = [
  {title: 'All Products', handle: 'all'},
  {title: 'Apparel', handle: 'apparel'},
  {title: 'Music', handle: 'music'},
  {title: 'Accessories', handle: 'accessories'},
  {title: 'Shot Glasses', handle: 'shot-glasses'},
  {title: 'Exclusives', handle: 'exclusives'},
  {title: 'New Arrivals', handle: 'new-arrivals'},
];

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    tags
    productType
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
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

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
