import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    defaultSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://*.youtube.com',
      'https://*.ytimg.com',
      'https://www.youtube-nocookie.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://i.ytimg.com',
      'https://img.youtube.com',
      'https://i3.ytimg.com',
      'https://i1.ytimg.com',
      'https://*.ytimg.com',
      'https://*.googleusercontent.com',
    ],
    frameSrc: [
      "'self'",
      'https://www.youtube.com',
      'https://youtube.com',
      'https://www.youtube-nocookie.com',
      'https://*.youtube.com',
    ],
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://*.youtube.com',
      'https://www.google-analytics.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
