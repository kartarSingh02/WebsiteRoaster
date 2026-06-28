export function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
