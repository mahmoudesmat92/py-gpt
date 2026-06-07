## 2024-05-22 - Missing tooltips on icon-only UI buttons
**Learning:** In Qt/PySide6, icon-only buttons without explicit text lack an accessible name for screen readers, breaking accessibility. In PyGPT, many "Add" buttons in the toolbox panels (e.g. Presets, Assistants) and utility tool buttons (e.g. Indexer in Explorer) were instantiated with an icon and an empty string (`""`), but had no `.setToolTip()` assigned.
**Action:** Always verify that `QPushButton(QIcon, "")` has a subsequent `.setToolTip(trans('...'))` call applied to ensure accessibility and better user experience.
