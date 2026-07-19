## 2024-05-19 - Accessible Tooltips for PySide6 Icon-Only Buttons
**Learning:** In PySide6, icon-only buttons (`QPushButton(QIcon, "")`) lack accessible names by default, which creates issues for screen readers.
**Action:** Always verify that icon-only buttons have an accessible name applied using `setToolTip()`, preferably leveraging the existing `trans()` localization utility for screen reader accessibility and general UX.
