export async function fetchSiteHtml(url) {
  const startedAt = performance.now();

  const response = await fetch("/api/fetch-site", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch website");
  }

  return {
    html: data.html,
    size: data.html.length,
    fetchTimeMs: Math.round(performance.now() - startedAt),
  };
}