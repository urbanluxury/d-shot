import {redirect, useLoaderData, Link, useParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {PageHero} from '~/components/PageHero';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}, {metaobjects: shopCategories}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
    storefront.query(SHOP_CATEGORIES_QUERY),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    shopCategories,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, shopCategories} = useLoaderData<typeof loader>();
  const {handle} = useParams();

  // Parse shop categories from metaobject
  const categories = shopCategories?.nodes?.map((node: any) => {
    const fields = node.fields.reduce((acc: any, field: any) => {
      acc[field.key] = field.value;
      return acc;
    }, {});
    return {
      title: fields.title,
      handle: fields.collection_handle,
      order: parseInt(fields.sort_order || '0'),
    };
  }).sort((a: any, b: any) => a.order - b.order) || [];

  return (
    <div className="collection bg-black min-h-screen">
      <PageHero
        title={collection.title}
        subtitle={collection.description}
        label="Collection"
      />

      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hidden on mobile, shown on desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-dark-gray rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-display uppercase text-white mb-6">Shop By</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Categories</h4>
                <nav className="space-y-2">
                  <Link
                    to="/collections/all"
                    className="block text-white/80 hover:text-champagne transition-colors"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/collections/apparel"
                    className={`block transition-colors ${handle === 'apparel' ? 'text-champagne font-medium' : 'text-white/80 hover:text-champagne'}`}
                  >
                    Apparel
                  </Link>
                  <Link
                    to="/collections/music"
                    className={`block transition-colors ${handle === 'music' ? 'text-champagne font-medium' : 'text-white/80 hover:text-champagne'}`}
                  >
                    Music
                  </Link>
                  <Link
                    to="/collections/accessories"
                    className={`block transition-colors ${handle === 'accessories' ? 'text-champagne font-medium' : 'text-white/80 hover:text-champagne'}`}
                  >
                    Accessories
                  </Link>
                  <Link
                    to="/collections/shot-glasses"
                    className={`block transition-colors ${handle === 'shot-glasses' ? 'text-champagne font-medium' : 'text-white/80 hover:text-champagne'}`}
                  >
                    Shot Glasses
                  </Link>
                  <Link
                    to="/collections/exclusives"
                    className={`block transition-colors ${handle === 'exclusives' ? 'text-champagne font-medium' : 'text-white/80 hover:text-champagne'}`}
                  >
                    Exclusives
                  </Link>
                  <Link
                    to="/collections/new-arrivals"
                    className={`block transition-colors ${handle === 'new-arrivals' ? 'text-champagne font-medium' : 'text-white/80 hover:text-champagne'}`}
                  >
                    New Arrivals
                  </Link>
                </nav>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-champagne transition-colors">
                    <input type="checkbox" className="rounded border-white/20 bg-black text-champagne focus:ring-champagne" />
                    <span>Under $25</span>
                  </label>
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-champagne transition-colors">
                    <input type="checkbox" className="rounded border-white/20 bg-black text-champagne focus:ring-champagne" />
                    <span>$25 - $50</span>
                  </label>
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-champagne transition-colors">
                    <input type="checkbox" className="rounded border-white/20 bg-black text-champagne focus:ring-champagne" />
                    <span>$50 - $100</span>
                  </label>
                  <label className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-champagne transition-colors">
                    <input type="checkbox" className="rounded border-white/20 bg-black text-champagne focus:ring-champagne" />
                    <span>$100+</span>
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-white/60 text-sm uppercase tracking-wider mb-3">Sort By</h4>
                <select className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:border-champagne focus:outline-none">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-white/60">
                {collection.products.nodes.length} products
              </p>
            </div>

            <PaginatedResourceSection<ProductItemFragment>
              connection={collection.products}
              resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {({node: product, index}) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 8 ? 'eager' : undefined}
                />
              )}
            </PaginatedResourceSection>
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

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
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
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
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

const SHOP_CATEGORIES_QUERY = `#graphql
  query ShopCategories {
    metaobjects(type: "shop_category", first: 20) {
      nodes {
        handle
        fields {
          key
          value
        }
      }
    }
  }
` as const;
