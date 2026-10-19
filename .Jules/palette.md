## 2026-05-09 - Accessibility of Icon-Only Buttons
**Learning:** The application extensively uses `QPushButton(QIcon, "")` for compact UI elements. Without `setToolTip()`, these buttons lack accessible names, making them difficult for screen reader users to identify and hiding their purpose from sighted users on hover.
**Action:** When creating icon-only `QPushButton`s or similar widgets, always provide an accessible name via `setToolTip(trans('...'))`.
