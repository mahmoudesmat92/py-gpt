## 2024-05-01 - Add tooltips to icon-only buttons
**Learning:** Found several icon-only buttons (`QPushButton(QIcon(..), "")`) across various UI components (file explorer, toolboxes, dialogs) that lack `setToolTip()`. These buttons are inaccessible to screen readers and confusing to sighted users since they have no visible text or descriptive tooltips.
**Action:** Add appropriate `setToolTip(trans("..."))` calls to these buttons using existing localization strings.
