## 2024-07-24 - Accessibility improvements for icon-only buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon("..."), "")`) without tooltips lack accessible names for screen readers and context for visual users.
**Action:** When implementing icon-only buttons, always apply tooltips using `setToolTip(trans('...'))` to ensure they have an accessible name and hover context.
