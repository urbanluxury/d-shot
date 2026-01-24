import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {type CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isPage = layout === 'page';

  return (
    <div
      aria-labelledby="cart-summary"
      className={`${isPage ? 'bg-gray-100 rounded-lg p-6 h-fit sticky top-24' : 'border-t border-white/10 pt-6 mt-6'}`}
    >
      <h4 className={`text-xl font-display uppercase mb-6 ${isPage ? 'text-black' : 'text-white'}`}>Order Summary</h4>

      <div className="space-y-3 mb-6">
        <div className={`flex justify-between ${isPage ? 'text-black/70' : 'text-white/70'}`}>
          <span>Subtotal</span>
          <span className={isPage ? 'text-black' : 'text-white'}>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        <div className={`flex justify-between ${isPage ? 'text-black/70' : 'text-white/70'}`}>
          <span>Shipping</span>
          <span className={isPage ? 'text-black/50' : 'text-white/50'}>Calculated at checkout</span>
        </div>
      </div>

      <CartDiscounts discountCodes={cart?.discountCodes} layout={layout} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />

      <div className={`border-t pt-4 mt-4 mb-6 ${isPage ? 'border-gray-300' : 'border-white/10'}`}>
        <div className="flex justify-between text-lg">
          <span className={`font-display uppercase ${isPage ? 'text-black' : 'text-white'}`}>Total</span>
          <span className={`font-display text-xl ${isPage ? 'text-merlot' : 'text-champagne'}`}>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
      </div>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      {/* Trust badges */}
      <div className={`flex items-center justify-center gap-4 mt-6 pt-6 border-t ${isPage ? 'border-gray-300' : 'border-white/10'}`}>
        <div className={`flex items-center gap-1 text-xs ${isPage ? 'text-black/40' : 'text-white/40'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isPage ? 'text-black/40' : 'text-white/40'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="block w-full py-4 px-8 bg-champagne hover:bg-white text-black font-display uppercase tracking-wider text-center text-lg rounded-md transition-all"
    >
      Proceed to Checkout
    </a>
  );
}

function CartDiscounts({
  discountCodes,
  layout = 'aside',
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  layout?: CartLayout;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];
  const isPage = layout === 'page';

  return (
    <div className="mb-4">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <div className="flex items-center justify-between bg-merlot/20 rounded-md px-3 py-2 mb-3">
          <div className="flex items-center gap-2">
            <svg className={`w-4 h-4 ${isPage ? 'text-merlot' : 'text-champagne'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <code className={`text-sm ${isPage ? 'text-merlot' : 'text-champagne'}`}>{codes?.join(', ')}</code>
          </div>
          <UpdateDiscountForm>
            <button className={`text-xs ${isPage ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'}`}>Remove</button>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className={`flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none ${isPage ? 'bg-white border-gray-300 text-black placeholder:text-black/40 focus:border-merlot' : 'bg-black border-white/20 text-white placeholder:text-white/40 focus:border-champagne'}`}
          />
          <button
            type="submit"
            className={`px-4 py-2 border rounded-md text-sm transition-colors ${isPage ? 'border-gray-300 text-black hover:border-merlot hover:text-merlot' : 'border-white/20 text-white hover:border-champagne hover:text-champagne'}`}
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  // Clear the gift card code input after the gift card is added
  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div>
      {/* Display applied gift cards with individual remove buttons */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
        fetcherKey="gift-card-add"
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'}>
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

