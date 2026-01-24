import type {Route} from './+types/collections.all';
import {useLoaderData, Link, useSearchParams, useNavigate} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PageHero} from '~/components/PageHero';
import {ProductFilters, filterProducts} from '~/components/ProductFilters';
import {MobileFilters} from '~/components/MobileFilters';

export const meta: Route.MetaFunction = () => {
  return [{title: `D-Shot | All Products`}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {...paginationVariables},
  });

  return {products};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const allProducts = products.nodes;
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
    <div className="collection bg-white min-h-screen">
      <PageHero
        title="All Products"
        subtitle="Official D-Shot Merchandise & Music"
        label="Shop"
      />

      <div className="container py-12">
        {/* Grid: 25% sidebar / 75% products on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar - 25% (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-100 rounded-lg p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-display uppercase text-black mb-6">Filter By</h3>
              <ProductFilters products={allProducts} currentHandle="all" />
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
                  currentHandle="all"
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
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black text-base focus:border-merlot focus:outline-none"
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
                {sortedProducts.map((product: any, index: number) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.handle}`}
                    className="group"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-black/60 text-lg mb-4">No products match your filters</p>
                <button
                  onClick={() => navigate('/collections/all')}
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
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
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

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
