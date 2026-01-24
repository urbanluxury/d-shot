import {redirect, useLoaderData, Link, useParams, useSearchParams, useNavigate} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Image, Money} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PageHero} from '~/components/PageHero';
import {ProductFilters, filterProducts} from '~/components/ProductFilters';
import {MobileFilters} from '~/components/MobileFilters';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `D-Shot | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

// Color mapping for visual swatches
const COLOR_MAP: Record<string, string> = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Black/Gold': '#000000',
  'All Black': '#000000',
  'Navy': '#1a237e',
  'Burgundy': '#722F37',
  'Red': '#d32f2f',
  'Blue': '#1976d2',
  'Green': '#388e3c',
  'Gray': '#757575',
  'Grey': '#757575',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Maroon': '#800000',
  'Forest': '#228B22',
};

function getColorSwatches(product: any): {color: string; value: string}[] {
  const colorOption = product.variants?.nodes
    ?.flatMap((v: any) => v.selectedOptions)
    ?.filter((opt: any) => opt.name === 'Color' || opt.name === 'Style');

  if (!colorOption || colorOption.length === 0) return [];

  const uniqueColors = [...new Set(colorOption.map((opt: any) => opt.value))] as string[];
  return uniqueColors.map((value) => ({
    value,
    color: COLOR_MAP[value] || '#888888',
  }));
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const {handle} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const allProducts = collection.products.nodes;
  const filteredProducts = filterProducts(allProducts, searchParams);

  // Sort
  const sort = searchParams.get('sort') || 'featured';
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sort) {
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

  // Count active filters for mobile badge
  const activeFilterCount = [
    searchParams.get('type'),
    searchParams.get('vendor'),
    searchParams.get('size'),
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
  ].filter(Boolean).length;

  const handleSort = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    navigate(`?${params.toString()}`, {replace: true});
  };

  return (
    <div className="collection min-h-screen">
      <PageHero
        title={collection.title}
        subtitle={collection.description}
        label="Collection"
      />

      {/* White background merchandise section */}
      <div className="bg-white">
        <div className="container py-12">
          {/* Grid: 25% sidebar / 75% products on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar - 25% (hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-gray-100 rounded-lg p-6 lg:sticky lg:top-24">
                <h3 className="text-lg font-display uppercase text-black mb-6">Filter By</h3>
                <ProductFilters products={allProducts} currentHandle={handle} />
              </div>
            </div>

            {/* Products - 75% */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <MobileFilters
                    products={allProducts}
                    currentHandle={handle}
                    activeFilterCount={activeFilterCount}
                  />
                </div>
                <p className="text-black/70 hidden lg:block text-base">
                  {sortedProducts.length} products
                </p>
                <p className="text-black/70 lg:hidden">
                  {sortedProducts.length} items
                </p>
                <select
                  value={sort}
                  onChange={(e) => handleSort(e.target.value)}
                  className="bg-gray-100 border border-black/20 rounded-lg px-4 py-3 text-black text-base focus:border-merlot focus:outline-none"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Name: A-Z</option>
                  <option value="title-desc">Name: Z-A</option>
                </select>
              </div>

              {/* Product Grid */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {sortedProducts.map((product: any, index: number) => {
                    const colorSwatches = getColorSwatches(product);
                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.handle}`}
                        className="group"
                      >
                        <div className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
                          {product.featuredImage ? (
                            <Image
                              alt={product.featuredImage.altText || product.title}
                              data={product.featuredImage}
                              loading={index < 8 ? 'eager' : 'lazy'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="font-display uppercase text-black text-base group-hover:text-merlot transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-merlot font-display text-lg mt-1">
                          <Money data={product.priceRange.minVariantPrice} />
                        </p>
                        {/* Color Swatches */}
                        {colorSwatches.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {colorSwatches.slice(0, 4).map((swatch, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{backgroundColor: swatch.color}}
                                title={swatch.value}
                              />
                            ))}
                            {colorSwatches.length > 4 && (
                              <span className="text-sm text-black/60 ml-1">
                                +{colorSwatches.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-black/60 text-lg mb-4">No products match your filters</p>
                  <button
                    onClick={() => navigate(`/collections/${handle}`)}
                    className="text-merlot hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
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
