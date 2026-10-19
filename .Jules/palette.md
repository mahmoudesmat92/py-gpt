## 2025-01-20 - Add missing accessible names (tooltips) for icon-only buttons
**Learning:** In PySide6/Qt, icon-only buttons (`QPushButton(QIcon, "")`) must have `setToolTip` to provide an accessible name for screen readers, similar to ARIA labels on web buttons. Some core utility buttons (add preset, add assistant, toggle indexer) lacked this context.
**Action:** Always verify that `QPushButton` instances instantiated with only `QIcon` (no visible text string) have an appropriate `setToolTip()` called right after initialization using localized strings via `trans()`.
