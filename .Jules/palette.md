## 2024-06-08 - Added Tooltips to Icon-Only Buttons
**Learning:** In Qt/PySide6 desktop applications, icon-only buttons (`QPushButton(QIcon, "")`) are inaccessible to screen readers and difficult for users to understand without hover context.
**Action:** Always append `.setToolTip(trans("..."))` using the translation engine immediately after creating icon-only `QPushButtons` to ensure accessibility and clarity.
