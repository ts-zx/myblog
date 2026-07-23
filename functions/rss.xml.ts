// Pages Function: serve /rss.xml with no-cache headers
// Workaround for static export: next.config.mjs headers() doesn't work
// with output:"export", so we override the cache headers here.
//
// This function intercepts requests to /rss.xml, fetches the static
// asset via context.next(), and returns it with no-cache headers.

export const onRequest: PagesFunction = async (context) => {
  // context.next() forwards to the static asset (rss.xml in out/)
  const response = await context.next();

  // Clone so we can modify headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
};