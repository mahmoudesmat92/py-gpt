## 2024-05-24 - Accessibility tooltips for icon-only buttons
**Learning:** In PySide6/Qt UIs, icon-only buttons (like `QPushButton(QIcon, "")`) lack accessible names for screen readers unless explicitly provided.
**Action:** Always use `setToolTip(trans('...'))` on icon-only buttons to ensure they have an accessible name for screen readers, acting similarly to ARIA labels in web development.
