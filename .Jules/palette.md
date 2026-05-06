## 2024-05-19 - Accessible Tooltips on Icon-Only Buttons
**Learning:** PySide6/Qt UIs commonly use `QPushButton(QIcon("..."), "")` to render clean, icon-only buttons. However, without text, these lack an accessible name for screen readers.
**Action:** Always ensure that any icon-only button is followed by a `.setToolTip(trans('...'))` call using the application's localization utility to provide both an accessible name and a helpful hover hint for users.
