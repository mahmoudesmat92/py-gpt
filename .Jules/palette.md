## 2024-05-18 - Added Tooltips to Icon-Only Buttons
**Learning:** Found several icon-only `QPushButtons` throughout the app (file explorer, toolboxes, agent builder list) that lacked `setToolTip`. This is a common accessibility/UX pitfall in desktop UI frameworks like PySide6. By using the existing localization patterns (`trans(...)`), it is easy to add helpful labels to these buttons.
**Action:** When creating or reviewing icon-only buttons (`QPushButton(QIcon("..."), "")`), always check if `setToolTip(trans(...))` is present so screen readers and users have a text alternative.
