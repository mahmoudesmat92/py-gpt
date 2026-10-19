## 2024-05-24 - Accessibility: Missing tooltips on icon-only buttons
**Learning:** PySide6/Qt UIs need tooltips on icon-only buttons (`QPushButton(QIcon, "")`) so screen readers have an accessible name, but buttons with visible text labels should not have redundant tooltips.
**Action:** When adding tooltips to buttons for accessibility, verify if it's an icon-only button and use `setToolTip(trans('...'))`.
