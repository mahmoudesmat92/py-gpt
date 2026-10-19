## 2024-05-19 - Added ARIA Tooltips to Icon-Only Buttons
**Learning:** PySide6/Qt UIs often suffer from inaccessible icon-only buttons (like `QPushButton(QIcon, "")`) if developers forget to set a tooltip. This makes them invisible to screen readers and difficult to interpret for visual users.
**Action:** Always verify `setToolTip()` is used when initializing empty-string QPushButtons with icons.
