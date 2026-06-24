## 2024-05-18 - Tooltips for icon-only buttons
**Learning:** Some auxiliary icon-only action buttons (e.g., adding presets, assistants, agents) lacked tooltips, making them inaccessible to screen readers and ambiguous to users.
**Action:** Always verify that `QPushButton(QIcon("..."), "")` instantiations are accompanied by a `.setToolTip(trans("..."))` call.
