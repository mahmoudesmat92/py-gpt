## 2024-05-19 - Added ARIA label tooltips to icon-only buttons
**Learning:** In PySide6/Qt, icon-only buttons (`QPushButton(QIcon, "")`) do not natively expose an accessible name to screen readers. We must explicitly set tooltips (`setToolTip()`) to provide accessible labels for these interactive elements.
**Action:** When adding or auditing icon-only buttons in the PySide6 UI, ensure `setToolTip(trans('...'))` is always included so that the element is properly described by screen readers.
