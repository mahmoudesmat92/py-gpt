## 2024-05-14 - Icon-only PySide6 buttons require tooltips
**Learning:** In PySide6/Qt UIs, icon-only buttons (like `QPushButton(QIcon, "")`) lack accessible names for screen readers, unlike web `aria-label` attributes.
**Action:** When adding icon-only buttons in PySide6/Qt, always apply a tooltip via `setToolTip(trans('...'))` to ensure they have an accessible name and hover explanation.
