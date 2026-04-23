## 2024-05-24 - [Initialization]
## 2024-05-24 - [Add tooltips to icon-only buttons]
**Learning:** In PySide6/Qt, icon-only buttons (e.g., `QPushButton(QIcon, "")`) must have tooltips applied via `setToolTip(trans('...'))` to ensure they have an accessible name for screen readers.
**Action:** Always add `setToolTip` with a descriptive string (ideally translated using `trans()`) when instantiating icon-only buttons.
