## 2024-05-15 - Missing Tooltips on Icon-Only Buttons
**Learning:** PySide6/Qt icon-only buttons need explicit tooltips via `setToolTip(trans('...'))` to ensure they have an accessible name for screen readers.
**Action:** Always add tooltips to `QPushButton(QIcon, "")` instances.
