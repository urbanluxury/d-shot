import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const isPage = layout === 'page';

  return (
    <li key={id} className={`cart-line rounded-lg p-4 flex gap-4 ${isPage ? 'bg-gray-100' : 'bg-dark-gray'}`}>
      {image && (
        <div className={`w-24 h-24 rounded-md overflow-hidden flex-shrink-0 ${isPage ? 'bg-gray-200' : 'bg-gray'}`}>
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="block"
        >
          <h4 className={`font-display uppercase text-lg truncate hover:text-merlot transition-colors ${isPage ? 'text-black' : 'text-white hover:text-champagne'}`}>
            {product.title}
          </h4>
        </Link>
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedOptions.map((option) => (
            <span key={option.name} className={`text-sm ${isPage ? 'text-black/50' : 'text-white/50'}`}>
              {option.name}: {option.value}
            </span>
          ))}
        </div>
        <div className={`font-display text-lg mt-2 ${isPage ? 'text-merlot' : 'text-champagne'}`}>
          <ProductPrice price={line?.cost?.totalAmount} />
        </div>
        <CartLineQuantity line={line} layout={layout} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line, layout = 'aside'}: {line: CartLine; layout?: CartLayout}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));
  const isPage = layout === 'page';

  return (
    <div className="flex items-center gap-4 mt-3">
      <div className={`flex items-center border rounded-md ${isPage ? 'border-gray-300' : 'border-white/20'}`}>
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className={`w-8 h-8 flex items-center justify-center disabled:opacity-30 transition-colors ${isPage ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'}`}
          >
            <span>−</span>
          </button>
        </CartLineUpdateButton>
        <span className={`w-8 text-center ${isPage ? 'text-black' : 'text-white'}`}>{quantity}</span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className={`w-8 h-8 flex items-center justify-center disabled:opacity-30 transition-colors ${isPage ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'}`}
          >
            <span>+</span>
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} layout={layout} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
  layout = 'aside',
}: {
  lineIds: string[];
  disabled: boolean;
  layout?: CartLayout;
}) {
  const isPage = layout === 'page';
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className={`text-sm transition-colors disabled:opacity-30 ${isPage ? 'text-black/40 hover:text-red-500' : 'text-white/40 hover:text-red-500'}`}
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
