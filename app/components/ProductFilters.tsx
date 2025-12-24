import {useState} from 'react';
import {useSearchParams, useNavigate, useLocation} from 'react-router';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'price-range' | 'color';
  options: FilterOption[];
}

interface ProductFiltersProps {
  filters: FilterGroup[];
  productCount: number;
}

export function ProductFilters({filters, productCount}: ProductFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'product-type': true,
    'size': true,
    'color': true,
    'price': true,
  });

  // Get active filters from URL
  const getActiveFilters = () => {
    const active: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter.')) {
        const filterKey = key.replace('filter.', '');
        if (!active[filterKey]) active[filterKey] = [];
        active[filterKey].push(value);
      }
    });
    return active;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Toggle filter value
  const toggleFilter = (groupId: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const filterKey = `filter.${groupId}`;
    const currentValues = newParams.getAll(filterKey);

    if (currentValues.includes(value)) {
      // Remove filter
      newParams.delete(filterKey);
      currentValues.filter(v => v !== value).forEach(v => newParams.append(filterKey, v));
    } else {
      // Add filter
      newParams.append(filterKey, value);
    }

    navigate(`${location.pathname}?${newParams.toString()}`, {replace: true});
  };

  // Set price range
  const setPriceRange = (min: string, max: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('filter.price.min');
    newParams.delete('filter.price.max');

    if (min) newParams.set('filter.price.min', min);
    if (max) newParams.set('filter.price.max', max);

    navigate(`${location.pathname}?${newParams.toString()}`, {replace: true});
  };

  // Clear all filters
  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    // Keep non-filter params like sort
    searchParams.forEach((value, key) => {
      if (!key.startsWith('filter.')) {
        newParams.set(key, value);
      }
    });
    navigate(`${location.pathname}?${newParams.toString()}`, {replace: true});
  };

  // Remove single filter
  const removeFilter = (groupId: string, value: string) => {
    toggleFilter(groupId, value);
  };

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="product-filters">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display uppercase text-white">Filter By</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-champagne hover:text-white transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6 pb-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([groupId, values]) =>
              values.map(value => (
                <button
                  key={`${groupId}-${value}`}
                  onClick={() => removeFilter(groupId, value)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-champagne/20 text-champagne text-xs rounded-full hover:bg-champagne/30 transition-colors"
                >
                  <span>{value}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        {filters.map((group) => (
          <FilterSection
            key={group.id}
            group={group}
            isExpanded={expandedSections[group.id] ?? true}
            onToggle={() => toggleSection(group.id)}
            activeValues={activeFilters[group.id] || []}
            onFilterChange={(value) => toggleFilter(group.id, value)}
            onPriceChange={group.type === 'price-range' ? setPriceRange : undefined}
            searchParams={searchParams}
          />
        ))}
      </div>

      {/* Product Count */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-white/60 text-sm">
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </p>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  group: FilterGroup;
  isExpanded: boolean;
  onToggle: () => void;
  activeValues: string[];
  onFilterChange: (value: string) => void;
  onPriceChange?: (min: string, max: string) => void;
  searchParams: URLSearchParams;
}

function FilterSection({
  group,
  isExpanded,
  onToggle,
  activeValues,
  onFilterChange,
  onPriceChange,
  searchParams,
}: FilterSectionProps) {
  return (
    <div className="border-b border-white/10 pb-4">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <span className="text-white/80 text-sm uppercase tracking-wider font-medium">
          {group.label}
        </span>
        <svg
          className={`w-4 h-4 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {group.type === 'checkbox' && (
            <CheckboxFilters
              options={group.options}
              activeValues={activeValues}
              onChange={onFilterChange}
            />
          )}
          {group.type === 'color' && (
            <ColorFilters
              options={group.options}
              activeValues={activeValues}
              onChange={onFilterChange}
            />
          )}
          {group.type === 'price-range' && onPriceChange && (
            <PriceRangeFilter
              onChange={onPriceChange}
              searchParams={searchParams}
            />
          )}
        </div>
      )}
    </div>
  );
}

function CheckboxFilters({
  options,
  activeValues,
  onChange,
}: {
  options: FilterOption[];
  activeValues: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={activeValues.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 rounded border-white/30 bg-transparent text-champagne focus:ring-champagne focus:ring-offset-0 focus:ring-offset-transparent"
          />
          <span className="text-white/70 text-sm group-hover:text-white transition-colors flex-1">
            {option.label}
          </span>
          {option.count !== undefined && (
            <span className="text-white/40 text-xs">({option.count})</span>
          )}
        </label>
      ))}
    </div>
  );
}

function ColorFilters({
  options,
  activeValues,
  onChange,
}: {
  options: FilterOption[];
  activeValues: string[];
  onChange: (value: string) => void;
}) {
  // Color mapping for common colors
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#DC2626',
    blue: '#2563EB',
    green: '#16A34A',
    yellow: '#EAB308',
    orange: '#EA580C',
    purple: '#9333EA',
    pink: '#EC4899',
    gray: '#6B7280',
    grey: '#6B7280',
    brown: '#92400E',
    navy: '#1E3A5F',
    burgundy: '#722F37',
    gold: '#D4AF37',
    silver: '#C0C0C0',
    champagne: '#F7E7CE',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const colorValue = colorMap[option.value.toLowerCase()] || option.value;
        const isActive = activeValues.includes(option.value);
        const isLight = ['white', 'champagne', 'yellow', 'silver'].includes(option.value.toLowerCase());

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              isActive
                ? 'border-champagne scale-110'
                : 'border-white/20 hover:border-white/40'
            }`}
            style={{backgroundColor: colorValue}}
            title={option.label}
          >
            {isActive && (
              <svg
                className={`w-4 h-4 mx-auto ${isLight ? 'text-black' : 'text-white'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PriceRangeFilter({
  onChange,
  searchParams,
}: {
  onChange: (min: string, max: string) => void;
  searchParams: URLSearchParams;
}) {
  const currentMin = searchParams.get('filter.price.min') || '';
  const currentMax = searchParams.get('filter.price.max') || '';
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);

  const priceRanges = [
    {label: 'Under $25', min: '0', max: '25'},
    {label: '$25 - $50', min: '25', max: '50'},
    {label: '$50 - $100', min: '50', max: '100'},
    {label: '$100 - $200', min: '100', max: '200'},
    {label: '$200+', min: '200', max: ''},
  ];

  const handleApply = () => {
    onChange(min, max);
  };

  const handleQuickSelect = (rangeMin: string, rangeMax: string) => {
    setMin(rangeMin);
    setMax(rangeMax);
    onChange(rangeMin, rangeMax);
  };

  return (
    <div className="space-y-4">
      {/* Quick Select Ranges */}
      <div className="space-y-2">
        {priceRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => handleQuickSelect(range.min, range.max)}
            className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              currentMin === range.min && currentMax === range.max
                ? 'bg-champagne/20 text-champagne'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Range */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Custom Range</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-sm placeholder:text-white/30 focus:border-champagne focus:outline-none"
            />
          </div>
          <span className="text-white/40">-</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white text-sm placeholder:text-white/30 focus:border-champagne focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleApply}
          className="mt-3 w-full py-2 bg-champagne/20 text-champagne text-sm rounded hover:bg-champagne/30 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// Helper function to extract filters from products
export function extractFiltersFromProducts(products: any[]): FilterGroup[] {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const productTypes = new Set<string>();
  const vendors = new Set<string>();

  products.forEach((product) => {
    // Extract from tags
    product.tags?.forEach((tag: string) => {
      const lowerTag = tag.toLowerCase();
      // Size tags
      if (['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', 'xxl', 'xxxl', 'small', 'medium', 'large'].includes(lowerTag)) {
        sizes.add(tag);
      }
      // Color tags
      if (['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey', 'brown', 'navy', 'burgundy', 'gold', 'silver', 'champagne'].includes(lowerTag)) {
        colors.add(tag);
      }
    });

    // Extract from variants
    product.variants?.nodes?.forEach((variant: any) => {
      variant.selectedOptions?.forEach((option: any) => {
        if (option.name.toLowerCase() === 'size') {
          sizes.add(option.value);
        }
        if (option.name.toLowerCase() === 'color') {
          colors.add(option.value);
        }
      });
    });

    // Product type
    if (product.productType) {
      productTypes.add(product.productType);
    }

    // Vendor/Brand
    if (product.vendor) {
      vendors.add(product.vendor);
    }
  });

  const filters: FilterGroup[] = [];

  if (productTypes.size > 0) {
    filters.push({
      id: 'product-type',
      label: 'Product Type',
      type: 'checkbox',
      options: Array.from(productTypes).map(type => ({label: type, value: type})),
    });
  }

  if (sizes.size > 0) {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'XXL', 'XXXL'];
    const sortedSizes = Array.from(sizes).sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a.toUpperCase());
      const bIndex = sizeOrder.indexOf(b.toUpperCase());
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    filters.push({
      id: 'size',
      label: 'Size',
      type: 'checkbox',
      options: sortedSizes.map(size => ({label: size, value: size})),
    });
  }

  if (colors.size > 0) {
    filters.push({
      id: 'color',
      label: 'Color',
      type: 'color',
      options: Array.from(colors).map(color => ({
        label: color.charAt(0).toUpperCase() + color.slice(1),
        value: color,
      })),
    });
  }

  if (vendors.size > 0) {
    filters.push({
      id: 'vendor',
      label: 'Brand',
      type: 'checkbox',
      options: Array.from(vendors).map(vendor => ({label: vendor, value: vendor})),
    });
  }

  // Always add price range
  filters.push({
    id: 'price',
    label: 'Price',
    type: 'price-range',
    options: [],
  });

  return filters;
}

// Helper to filter products client-side
export function filterProducts(products: any[], searchParams: URLSearchParams): any[] {
  let filtered = [...products];

  // Get all filter params
  const activeFilters: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter.')) {
      const filterKey = key.replace('filter.', '');
      if (!activeFilters[filterKey]) activeFilters[filterKey] = [];
      activeFilters[filterKey].push(value);
    }
  });

  // Apply product type filter
  if (activeFilters['product-type']?.length) {
    filtered = filtered.filter(p =>
      activeFilters['product-type'].includes(p.productType)
    );
  }

  // Apply vendor/brand filter
  if (activeFilters['vendor']?.length) {
    filtered = filtered.filter(p =>
      activeFilters['vendor'].includes(p.vendor)
    );
  }

  // Apply size filter
  if (activeFilters['size']?.length) {
    filtered = filtered.filter(p => {
      // Check tags
      const hasTagMatch = p.tags?.some((tag: string) =>
        activeFilters['size'].some(size => size.toLowerCase() === tag.toLowerCase())
      );
      if (hasTagMatch) return true;

      // Check variants
      return p.variants?.nodes?.some((variant: any) =>
        variant.selectedOptions?.some((opt: any) =>
          opt.name.toLowerCase() === 'size' &&
          activeFilters['size'].includes(opt.value)
        )
      );
    });
  }

  // Apply color filter
  if (activeFilters['color']?.length) {
    filtered = filtered.filter(p => {
      // Check tags
      const hasTagMatch = p.tags?.some((tag: string) =>
        activeFilters['color'].some(color => color.toLowerCase() === tag.toLowerCase())
      );
      if (hasTagMatch) return true;

      // Check variants
      return p.variants?.nodes?.some((variant: any) =>
        variant.selectedOptions?.some((opt: any) =>
          opt.name.toLowerCase() === 'color' &&
          activeFilters['color'].some(color => color.toLowerCase() === opt.value.toLowerCase())
        )
      );
    });
  }

  // Apply price filter
  const minPrice = searchParams.get('filter.price.min');
  const maxPrice = searchParams.get('filter.price.max');

  if (minPrice || maxPrice) {
    filtered = filtered.filter(p => {
      const price = parseFloat(p.priceRange?.minVariantPrice?.amount || '0');
      if (minPrice && price < parseFloat(minPrice)) return false;
      if (maxPrice && price > parseFloat(maxPrice)) return false;
      return true;
    });
  }

  return filtered;
}
