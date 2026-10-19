## 2024-11-20 - [Tooltips on Icon-Only Buttons]
**Learning:** PySide6 buttons initialized only with a QIcon (e.g. `QPushButton(QIcon, "")`) lack accessible names for screen readers and helpful context for sighted users on hover. This pattern is common in toolboxes and dialog headers.
**Action:** Always add `.setToolTip(trans("..."))` to icon-only buttons to ensure they have an accessible name and hover text.
