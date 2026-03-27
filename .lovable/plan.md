

# Create DayTouchpointView Component

## Summary
Create the main touchpoint template that assembles 4 expandable/collapsible slot cards into a scrollable day experience, replacing the old DayTemplate for the new architecture.

## New File: `src/components/journey/DayTouchpointView.tsx`

### Props
- `dayNumber: number`
- `touchpoints: TouchpointData` (from `useChallengeData`)
- `progress: DayTouchpointProgress` (from `useTouchpointProgress`)
- `isReviewMode?: boolean` (default false)
- `onSlotComplete: (slot: TouchpointSlot, data: any) => void`

### Structure
1. **Root**: `theme-light levvia-page min-h-screen pb-24`
2. **Header** (px-6 pt-8 pb-4): Centered logo (`logo_livvia_azul.png`, h-8), day number label, theme title (`font-heading`), purpose subtitle
3. **Progress Bar** (px-6 pb-4): 4 circles (w-3 h-3) connected by lines, colored `bg-primary` if done / `bg-muted` if not, with `{completedSlots}/4` counter
4. **4 Touchpoint Cards** (px-6 space-y-3): Each is a `levvia-card` with:
   - **Header button** (always visible): emoji in colored circle (bg-primary/10 if done, bg-secondary/10 if active, bg-muted otherwise), slot name + time, green checkmark or chevron-down
   - **Body** (AnimatePresence, motion.div with height animation): renders MorningSlot/LunchSlot/AfternoonSlot/NightSlot with appropriate props
5. **Celebration card**: Only when all 4 done — "Dia N completo!" with warm subtitle, no confetti
6. **BottomNav** at bottom

### Auto-expand Logic
- `expandedSlot` state (TouchpointSlot | null)
- On mount + progress changes: auto-expand first undone slot; if all done, collapse all
- Clicking a card header toggles it (accordion — only one open at a time)
- Review mode: all collapsed by default, clickable

### Imports
- `getTouchpointConfig` from touchpointConfig
- `TouchpointData` from useChallengeData
- `DayTouchpointProgress` from useTouchpointProgress
- `TouchpointSlot` from touchpointConfig
- 4 slot components from touchpoints/
- `BottomNav`, logo, `AnimatePresence`/`motion`, `Check`/`ChevronDown` from lucide-react

## Files
- `src/components/journey/DayTouchpointView.tsx` — NEW
- No existing files modified

