## 2024-05-18 - Added Tooltips to Icon-Only Buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) lack accessible names for screen readers unless explicitly provided.
**Action:** Always add `.setToolTip(trans('...'))` to `QPushButton` instances that do not have text labels, using the appropriate localization key.
