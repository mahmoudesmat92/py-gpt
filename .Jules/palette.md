## 2026-04-21 - Tooltips on icon-only buttons
**Learning:** In PySide6/Qt UIs, icon-only buttons without text labels are completely inaccessible to screen readers and difficult to understand for sighted users without hovering. Adding tooltips using standard translation strings solves both issues gracefully without altering the layout.
**Action:** Always ensure any `QPushButton(QIcon, "")` calls are immediately followed by `.setToolTip()` to maintain accessibility standards.
