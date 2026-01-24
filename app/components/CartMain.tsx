import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={`cart-main ${withDiscount ? 'with-discount' : ''}`}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className={layout === 'page' ? 'grid lg:grid-cols-3 gap-8' : ''}>
        <div className={layout === 'page' ? 'lg:col-span-2' : ''} aria-labelledby="cart-lines">
          <div className="space-y-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </div>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  const isPage = layout === 'page';

  return (
    <div hidden={hidden} className="text-center py-16">
      <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isPage ? 'bg-gray-100' : 'bg-dark-gray'}`}>
        <svg className={`w-10 h-10 ${isPage ? 'text-gray-400' : 'text-white/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className={`text-2xl font-display uppercase mb-2 ${isPage ? 'text-black' : 'text-white'}`}>Your Cart is Empty</h3>
      <p className={`mb-8 ${isPage ? 'text-black/60' : 'text-white/60'}`}>
        Looks like you haven&rsquo;t added anything yet.
      </p>
      <Link
        to="/collections/all"
        onClick={close}
        prefetch="viewport"
        className="inline-block px-8 py-4 bg-merlot hover:bg-merlot-dark text-white font-display uppercase tracking-wider rounded-md transition-all"
      >
        Start Shopping
      </Link>
    </div>
  );
}
