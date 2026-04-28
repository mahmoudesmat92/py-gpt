## 2024-05-24 - Missing Tooltips on Icon-Only UI Buttons
**Learning:** Icon-only buttons without tooltips lack accessible names for screen readers, diminishing overall usability and a11y compliance.
**Action:** Always add `.setToolTip(trans('...'))` directly onto any `QPushButton` initialized strictly with a `QIcon` and empty string or when it otherwise functions merely as a visual icon.
