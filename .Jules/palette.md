## 2024-05-24 - Accessibility tooltips for icon-only buttons
**Learning:** In PySide6/Qt, icon-only `QPushButton` elements do not provide an accessible name by default. Screen readers rely on tooltips to identify these buttons.
**Action:** Always add a localized tooltip (e.g., `button.setToolTip(trans('...'))`) when creating a `QPushButton` with only an icon and no text label.
