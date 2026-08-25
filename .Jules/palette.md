## 2026-08-25 - Added tooltips to icon-only buttons for accessibility
**Learning:** In PySide6/Qt, icon-only buttons (e.g., `QPushButton(QIcon, "")`) must have tooltips applied via `setToolTip(trans('...'))` to ensure they have an accessible name for screen readers and provide context to visual users.
**Action:** Always ensure icon-only buttons have descriptive tooltips set.
