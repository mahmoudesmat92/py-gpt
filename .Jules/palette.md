## 2024-05-24 - Accessibility for Icon-Only Buttons in PySide6 UI
**Learning:** In PySide6, creating icon-only buttons via `QPushButton(QIcon("..."), "")` results in elements without accessible text for screen readers or standard mouse tooltips, degrading the UX.
**Action:** Always follow up `QPushButton(QIcon, "")` instantiations with a `setToolTip(trans('...'))` call containing the localized string representation of the button's action.
