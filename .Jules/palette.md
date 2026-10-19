## 2023-10-27 - Icon-only buttons lack ARIA labels/tooltips
**Learning:** PySide6 uses `setToolTip` to provide accessible names for screen readers on icon-only buttons. Many prominent action buttons (like 'New' or 'Indexer') in `src/pygpt_net/ui/layout` and `ui/widget` lacked these.
**Action:** Always check `QPushButton(QIcon, "")` declarations for a corresponding `.setToolTip(trans('...'))` call. Avoid hardcoding text and always use the `trans()` utility from `pygpt_net.utils`.
