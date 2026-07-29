## 2026-07-29 - Add Tooltips to Icon-Only Buttons
**Learning:** In Qt/PySide6, icon-only buttons created with `QPushButton(QIcon, "")` require an explicit tooltip set via `setToolTip(trans('...'))` to be accessible to screen readers.
**Action:** Always verify if a button lacks visible text and ensure a localized tooltip is provided if it does.
