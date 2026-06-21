## 2025-02-18 - Added Tooltips to Icon-Only Buttons
**Learning:** In PySide6/Qt, `QPushButton`s that only use `QIcon`s without visible text lack an accessible name, making them unreadable for screen readers and confusing for users.
**Action:** Always verify if a button is icon-only and explicitly add `setToolTip(trans('...'))` to ensure it has a localized, accessible name.
