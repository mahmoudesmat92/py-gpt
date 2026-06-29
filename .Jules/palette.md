## 2025-05-18 - Missing Tooltips on Icon-Only Buttons
**Learning:** PySide6 UI panels often use icon-only buttons (e.g., `QPushButton(QIcon, "")`) which are inaccessible to screen readers without a tooltip.
**Action:** When adding or reviewing icon-only buttons in the UI, always verify that a tooltip is set using `.setToolTip(trans('key'))` to ensure an accessible name is provided.
