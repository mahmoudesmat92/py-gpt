## 2024-05-13 - Add tooltips to icon-only buttons
**Learning:** Icon-only buttons (like `QPushButton(QIcon("..."), "")`) in Qt applications lack accessible names for screen readers and are unclear to users without tooltips.
**Action:** Always verify that icon-only buttons have a `.setToolTip(trans("..."))` applied so they are accessible and user-friendly.
