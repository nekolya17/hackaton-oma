const defaultTiles = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
};

const customUrl = import.meta.env.VITE_MAP_TILE_URL?.trim();
const apiKey = import.meta.env.VITE_MAP_TILE_API_KEY?.trim();
const customAttribution = import.meta.env.VITE_MAP_TILE_ATTRIBUTION?.trim();

// An XYZ tile URL may contain {key}; the provider key stays in .env.local.
// Vite exposes VITE_ variables to the browser, so use a browser-safe,
// domain-restricted tile key rather than a server secret.
export const mapTiles = customUrl && customAttribution && (!customUrl.includes('{key}') || apiKey)
  ? {
      url: customUrl.replaceAll('{key}', encodeURIComponent(apiKey ?? '')),
      attribution: customAttribution,
    }
  : defaultTiles;
