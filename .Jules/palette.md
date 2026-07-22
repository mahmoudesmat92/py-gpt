## 2024-05-18 - Added Tooltips to Toolbox Buttons
**Learning:** Icon-only buttons created with `QPushButton(QIcon("..."), "")` need explicit `setToolTip()` calls using localized keys (via `trans()`) to be discoverable and accessible for screen readers, as the icon alone provides no text alternative in Qt.
**Action:** Always verify if a new `QPushButton` lacks text. If it does, ensure it has a `setToolTip()` configured using an appropriate key from `locale.en.ini`.
