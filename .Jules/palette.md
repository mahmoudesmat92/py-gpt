## 2026-07-02 - Icon-only buttons accessibility in PySide6
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) do not have an accessible name for screen readers by default. This makes them invisible or unhelpful to assistive technologies.
**Action:** Always add a tooltip via `setToolTip(trans('...'))` to icon-only buttons to ensure they have an accessible name for screen readers.
