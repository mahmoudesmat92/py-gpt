## 2024-05-24 - Accessibility tooltips for icon-only buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) inherently lack an accessible name unless a tooltip or accessible name property is explicitly set, making them unreadable to screen readers.
**Action:** Always ensure that any button created with an icon and no text string has `setToolTip(trans('...'))` properly applied so that it provides a descriptive, localized accessible name.
