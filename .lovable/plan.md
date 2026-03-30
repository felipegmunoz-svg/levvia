

# Add Debug useEffect to FlowSilhouette

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Add `useRef` and `useEffect` imports
- Line 1: add `useRef, useEffect` to the React import

### 2. Add `imgRef` and debug `useEffect` inside `FlowSilhouetteCore`
- After line 63 (before `return`), add:
```ts
const imgRef = useRef<HTMLImageElement>(null);

useEffect(() => {
  if (!imgRef.current) return;
  const img = imgRef.current;
  const onLoad = () => {
    console.log("📐 Imagem natural:", img.naturalWidth, "x", img.naturalHeight);
    console.log("📐 Imagem renderizada:", img.clientWidth, "x", img.clientHeight);
    console.log("📐 Container:", img.parentElement?.clientWidth, "x", img.parentElement?.clientHeight);
  };
  if (img.complete) onLoad();
  else img.addEventListener("load", onLoad);
}, []);
```

### 3. Attach ref to `<img>`
- Line 71–76: add `ref={imgRef}` to the `<img>` element

### 4. After implementation, navigate to the onboarding flow in the browser and capture console output

## Files modified
- `src/components/FlowSilhouette.tsx`

