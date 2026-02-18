---
"calligraph": patch
---

Fix flashing during number variant transitions when digit count changes. Wrap columns in AnimatePresence with propagate so inner exit animations fire when columns are removed. Use pixel-based distance instead of percentage for consistent digit slide. Improve text variant changeRatio to account for both added and removed characters.
