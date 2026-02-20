# calligraph

## 1.1.2

### Patch Changes

- cb4b14b: Fix number variant animating currency/prefix symbols (e.g. `$`, `€`) on value change. Prefix characters now keep stable keys and only use layout positioning, so they slide smoothly without triggering rolling, blur, or fade animations.

## 1.1.1

### Patch Changes

- 0d39946: Fix flashing during number variant transitions when digit count changes. Wrap columns in AnimatePresence with propagate so inner exit animations fire when columns are removed. Use pixel-based distance instead of percentage for consistent digit slide. Improve text variant changeRatio to account for both added and removed characters.

## 1.1.0

### Minor Changes

- 2899770: Add `variant` prop (`"text"` | `"number"`) for rolling digit transitions, and `animation` prop with spring presets (`"smooth"`, `"snappy"`, `"bouncy"`) inspired by SwiftUI.

## 1.0.5

### Patch Changes

- f97e6ff: Polish character animations:
  - stagger characters by position
  - faster exit transitions
- 2ab9dcc: Scale drift by the fraction of characters that changed so small edits (e.g. a single digit increment) produce subtle movement while large rewrites get the full spread.

## 1.0.4

### Patch Changes

- 7a9d8b6: - Reduce default duration to 0.38s and drift to 10px.
  - Simplify code block styles and improve accessibility.
  - Remove AGENTS.MD file

## 1.0.3

### Patch Changes

- 644d589: Re-release

## 1.0.2

### Patch Changes

- a606c08: Improve accessibility with aria-label and aria-hidden, fix O(n²) LCS backtracking, and narrow children type to string | number

## 1.0.1

### Patch Changes

- Rename package from calligraphy to calligraph.

## 1.0.0

### Major Changes

- ee4ebfa: First major release of Calligraph.
