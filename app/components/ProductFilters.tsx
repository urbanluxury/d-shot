import {Link, useSearchParams, useNavigate, useLocation} from 'react-router';

interface ProductFiltersProps {
  products: any[];
  currentHandle?: string;
}

export function ProductFilters({products, currentHandle}: ProductFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract unique values from products
  const productTypes = [...new Set(products.map(p => p.productType).filter(Boolean))];
  const vendors = [...new Set(products.map(p => p.vendor).filter(Boolean))];

  // Extract sizes from variants
  const sizes = new Set<string>();
  products.forEach(product => {
    product.variants?.nodes?.forEach((variant: any) => {
      variant.selectedOptions?.forEach((opt: any) => {
        if (opt.name.toLowerCase() === 'size') {
          sizes.add(opt.value);
        }
      });
    });
  });
  const sizeOptions = Array.from(sizes);

  // Get active filters
  const activeType = searchParams.get('type') || '';
  const activeVendor = searchParams.get('vendor') || '';
  const activeSize = searchParams.get('size') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeSort = searchParams.get('sort') || 'featured';

  const hasFilters = activeType || activeVendor || activeSize || activeMinPrice || activeMaxPrice;

  // Update filter
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`${location.pathname}?${params.toString()}`, {replace: true});
  };

  // Clear all filters
  const clearFilters = () => {
    navigate(location.pathname, {replace: true});
  };

  // Price range options
  const priceRanges = [
    {label: 'Under $25', min: '0', max: '25'},
    {label: '$25 - $50', min: '25', max: '50'},
    {label: '$50 - $100', min: '50', max: '100'},
    {label: '$100+', min: '100', max: ''},
  ];

  const setPriceRange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams);
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    navigate(`${location.pathname}?${params.toString()}`, {replace: true});
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-black/60 text-base uppercase tracking-wider mb-3">Categories</h4>
        <nav className="space-y-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.handle}
              to={`/collections/${cat.handle}`}
              className={`block text-base transition-colors py-1 ${
                currentHandle === cat.handle
                  ? 'text-merlot font-medium'
                  : 'text-black/70 hover:text-merlot'
              }`}
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="pt-4 border-t border-black/10">
          <button
            onClick={clearFilters}
            className="text-merlot text-base hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Product Type */}
      {productTypes.length > 0 && (
        <div className="pt-4 border-t border-black/10">
          <h4 className="text-black/60 text-base uppercase tracking-wider mb-3">Product Type</h4>
          <div className="space-y-3">
            {productTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group py-1">
                <input
                  type="radio"
                  name="productType"
                  checked={activeType === type}
                  onChange={() => setFilter('type', activeType === type ? '' : type)}
                  className="w-5 h-5 border-black/30 bg-transparent text-merlot focus:ring-merlot"
                />
                <span className="text-black/70 text-base group-hover:text-black">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizeOptions.length > 0 && (
        <div className="pt-4 border-t border-black/10">
          <h4 className="text-black/60 text-base uppercase tracking-wider mb-3">Size</h4>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setFilter('size', activeSize === size ? '' : size)}
                className={`px-4 py-2 text-base rounded border transition-colors ${
                  activeSize === size
                    ? 'bg-merlot text-white border-merlot'
                    : 'border-black/30 text-black/70 hover:border-merlot hover:text-merlot'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {vendors.length > 1 && (
        <div className="pt-4 border-t border-black/10">
          <h4 className="text-black/60 text-base uppercase tracking-wider mb-3">Brand</h4>
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <label key={vendor} className="flex items-center gap-3 cursor-pointer group py-1">
                <input
                  type="radio"
                  name="vendor"
                  checked={activeVendor === vendor}
                  onChange={() => setFilter('vendor', activeVendor === vendor ? '' : vendor)}
                  className="w-5 h-5 border-black/30 bg-transparent text-merlot focus:ring-merlot"
                />
                <span className="text-black/70 text-base group-hover:text-black">{vendor}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="pt-4 border-t border-black/10">
        <h4 className="text-black/60 text-base uppercase tracking-wider mb-3">Price</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setPriceRange(
                activeMinPrice === range.min && activeMaxPrice === range.max ? '' : range.min,
                activeMinPrice === range.min && activeMaxPrice === range.max ? '' : range.max
              )}
              className={`block w-full text-left px-4 py-3 text-base rounded transition-colors ${
                activeMinPrice === range.min && activeMaxPrice === range.max
                  ? 'bg-merlot/20 text-merlot'
                  : 'text-black/70 hover:bg-black/5 hover:text-black'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Filter products based on URL params
export function filterProducts(products: any[], searchParams: URLSearchParams): any[] {
  let filtered = [...products];

  const type = searchParams.get('type');
  const vendor = searchParams.get('vendor');
  const size = searchParams.get('size');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  if (type) {
    filtered = filtered.filter(p => p.productType === type);
  }

  if (vendor) {
    filtered = filtered.filter(p => p.vendor === vendor);
  }

  if (size) {
    filtered = filtered.filter(p =>
      p.variants?.nodes?.some((v: any) =>
        v.selectedOptions?.some((opt: any) =>
          opt.name.toLowerCase() === 'size' && opt.value === size
        )
      )
    );
  }

  if (minPrice) {
    filtered = filtered.filter(p =>
      parseFloat(p.priceRange?.minVariantPrice?.amount || '0') >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filtered = filtered.filter(p =>
      parseFloat(p.priceRange?.minVariantPrice?.amount || '0') <= parseFloat(maxPrice)
    );
  }

  return filtered;
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
