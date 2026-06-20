## 2024-06-20 - Adding Tooltips to Icon-Only Buttons
**Learning:** PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) require explicit `setToolTip` definitions to be accessible to screen readers, unlike web buttons which use `aria-label`. The application uses a robust translation system (`trans()`) for all UI strings.
**Action:** When adding or reviewing icon-only buttons in PySide6 applications, always ensure a localized tooltip is set using `setToolTip(trans('key'))` to guarantee accessibility without cluttering the visual UI.
