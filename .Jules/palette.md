## 2024-05-24 - Accessibility Tooltip for Icon-only Buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) do not have an accessible name for screen readers, unlike text buttons.
**Action:** When adding or encountering icon-only buttons, ensure a tooltip is applied using `setToolTip(trans('...'))` to provide an accessible name and improve the user experience.
