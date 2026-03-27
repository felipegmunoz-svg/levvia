

# Add maximumFileSizeToCacheInBytes to Workbox Config

## Summary
The build fails because the main JS chunk (2.12 MB) exceeds the default 2 MB PWA precache limit. Add `maximumFileSizeToCacheInBytes: 4 * 1024 * 1024` to the existing `workbox` config.

## Change in `vite.config.ts`

**Line 23** — Add the property to the existing `workbox` object:

```ts
workbox: {
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
  // ... rest unchanged
},
```

## Files modified
- `vite.config.ts` — 1 line added

