## 2024-05-19 - Accessible Tooltips for Icon-Only Buttons
**Learning:** PySide6/Qt UIs with icon-only buttons (`QPushButton(QIcon, "")`) are inaccessible to screen readers without a setToolTip. We can fix this by using `setToolTip` combined with the app's `trans()` utility function for proper localization.
**Action:** When adding or modifying icon-only buttons in PySide6 applications, always pair them with a localized tooltip (`setToolTip(trans('...'))`) to ensure accessibility and usability.
