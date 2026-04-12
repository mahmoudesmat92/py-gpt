## 2024-05-24 - Missing accessibility context on icon-only buttons
**Learning:** PySide6/Qt `QPushButton` elements instantiated without text labels (e.g., `QPushButton(QIcon("icon.svg"), "")`) are inaccessible to screen readers without an explicit tooltip or ARIA-equivalent property set.
**Action:** When adding new icon-only buttons, always assign a localized label via `.setToolTip(trans('...'))` to provide visual and screen reader accessibility context.
