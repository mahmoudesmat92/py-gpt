## 2024-03-24 - Accessibility tooltips on icon-only buttons
**Learning:** Found several icon-only buttons (`QPushButton(QIcon, "")`) in PySide6 dialogs (like agent builder, presets, assistants, and explorer tool buttons) that lacked tooltips, making them inaccessible to screen readers and confusing for users relying on hover context.
**Action:** Always verify that every `QPushButton` initialized without a text label receives an explicit `setToolTip(trans('...'))` using the application's localization system.
