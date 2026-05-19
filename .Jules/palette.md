## 2025-02-23 - Accessibility for Icon-only Buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) do not naturally expose accessible names for screen readers unless a tooltip is explicitly set. Without this, these buttons are completely unlabelled to assistive technologies.
**Action:** When adding new icon-only buttons to the UI, always set a localized tooltip using `setToolTip(trans('...'))` to ensure they are accessible.
