## 2026-04-26 - Added tooltips to icon-only buttons
**Learning:** PySide6 icon-only buttons (e.g. `QPushButton(QIcon, "")`) are inherently inaccessible to screen readers and confusing to users unless they have a tooltip set via `setToolTip()`.
**Action:** Always verify that `QPushButton`s instantiated with only an icon and an empty string also have a `setToolTip(trans('...'))` call accompanying them.
