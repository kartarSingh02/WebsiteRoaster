const PROXY_ENDPOINTS = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

export async function fetchSiteHtml(url) {
  let lastError = null;
  const startedAt = performance.now();

  for (const buildProxyUrl of PROXY_ENDPOINTS) {
    try {
      const response = await fetch(buildProxyUrl(url), {
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`Fetch failed (${response.status})`);
      }

      const html = await response.text();
      if (!html || html.length < 50) {
        throw new Error('Site returned empty content');
      }

      return {
        html,
        size: html.length,
        fetchTimeMs: Math.round(performance.now() - startedAt),
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message ||
      'Could not reach that site. It may block external access or be offline.'
  );
}
