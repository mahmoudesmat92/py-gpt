## 2024-05-18 - Missing Tooltips on Icon-Only Buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) do not have an accessible name for screen readers by default. Relying on visual context alone creates an accessibility barrier and a confusing UX for users who don't recognize the icon.
**Action:** Always verify that a `setToolTip()` is applied to any button initialized with an empty string label, ensuring a translated tooltip is provided for both hover discovery and assistive technologies.
