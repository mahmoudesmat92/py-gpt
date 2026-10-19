## $(date +%Y-%m-%d) - Added missing tooltips to icon-only buttons
**Learning:** Found multiple icon-only buttons (`QPushButton(QIcon, "")`) in PySide6 UI controllers that lacked tooltips. Without text or `aria-label` equivalents, these rely solely on iconography, making the UI less accessible and intuitive for new users.
**Action:** Always check `QPushButton` declarations where the text argument is empty `""` and add `.setToolTip(trans('...'))` using the appropriate localization key to provide an accessible name for screen readers and helpful context on hover.
