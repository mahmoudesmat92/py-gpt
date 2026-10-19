## 2024-05-18 - Tooltips for Icon-Only Buttons in PySide6
**Learning:** In PySide6 desktop applications, `QPushButton` elements initialized with only an icon (e.g., `QPushButton(QIcon(":/icons/add.svg"), "")`) lack an accessible name for screen readers and provide no context on hover, creating an accessibility and usability barrier.
**Action:** Always explicitly use `setToolTip(trans("..."))` on icon-only buttons to ensure they are accessible to screen readers and provide hover hints for users.
