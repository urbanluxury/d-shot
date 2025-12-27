import {useState} from 'react';
import {ProductFilters} from './ProductFilters';

interface MobileFiltersProps {
  products: any[];
  currentHandle?: string;
  activeFilterCount: number;
}

export function MobileFilters({products, currentHandle, activeFilterCount}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-dark-gray border border-white/20 rounded-lg px-5 py-3 text-white text-base"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
        {activeFilterCount > 0 && (
          <span className="bg-champagne text-black text-sm rounded-full w-6 h-6 flex items-center justify-center font-medium">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-dark-gray z-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-display uppercase text-white">Filter By</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="p-4">
              <ProductFilters products={products} currentHandle={currentHandle} />
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 p-4 bg-dark-gray border-t border-white/10">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-champagne text-black font-display uppercase py-3 rounded-lg hover:bg-champagne/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
