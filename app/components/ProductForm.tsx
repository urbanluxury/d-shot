import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

// Color mapping for visual swatches
const COLOR_SWATCH_MAP: Record<string, string> = {
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

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="product-form space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        // Check if this is a color option
        const isColorOption = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'style';

        return (
          <div className="product-options" key={option.name}>
            <h5 className="text-black/80 uppercase tracking-wider text-sm mb-3">{option.name}</h5>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                // For color options, show visual swatches (circles)
                const colorHex = COLOR_SWATCH_MAP[name] || swatch?.color;
                if (isColorOption && colorHex) {
                  const swatchClasses = `w-10 h-10 rounded-full border-2 transition-all ${
                    selected
                      ? 'border-merlot ring-2 ring-merlot ring-offset-2'
                      : 'border-gray-300 hover:border-merlot'
                  } ${!available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`;

                  if (isDifferentProduct) {
                    return (
                      <Link
                        className={swatchClasses}
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        title={name}
                        style={{backgroundColor: colorHex}}
                      />
                    );
                  } else {
                    return (
                      <button
                        type="button"
                        className={swatchClasses}
                        key={option.name + name}
                        disabled={!exists}
                        title={name}
                        style={{backgroundColor: colorHex}}
                        onClick={() => {
                          if (!selected) {
                            void navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                          }
                        }}
                      />
                    );
                  }
                }

                // For non-color options (Size, etc), show text buttons
                const baseClasses = `px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selected
                    ? 'bg-merlot text-white border-2 border-merlot'
                    : 'bg-gray-100 text-black border-2 border-gray-300 hover:border-merlot'
                } ${!available ? 'opacity-40 cursor-not-allowed' : ''}`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={baseClasses}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={baseClasses}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        <span className="w-full py-4 px-8 bg-merlot hover:bg-merlot-dark text-white font-display uppercase tracking-wider text-lg flex items-center justify-center gap-2 rounded-md transition-all">
          {selectedVariant?.availableForSale ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </>
          ) : (
            'Sold Out'
          )}
        </span>
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
