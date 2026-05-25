## 2024-05-18 - Icon-only Button Accessibility
**Learning:** In PySide6/Qt, icon-only buttons (`QPushButton(QIcon, "")`) lack an accessible name by default. This makes them completely invisible or confusing to screen reader users, violating accessibility guidelines.
**Action:** Always add a localized tooltip using `.setToolTip(trans('...'))` to any `QPushButton` that only contains an icon and no text. This ensures screen readers have an accessible name to read out.
