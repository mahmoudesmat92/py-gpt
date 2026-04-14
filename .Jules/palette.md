## 2024-11-20 - Add Tooltips to Icon-Only Buttons
**Learning:** In PySide6/Qt desktop apps like PyGPT, icon-only buttons (`QPushButton(QIcon, "")`) frequently lack tooltips by default. This makes them inaccessible to screen readers and difficult for users to understand without hovering or guessing based on context.
**Action:** When working in PySide6 UI files, always check for `QPushButton` instances that are initialized with only an icon. Ensure they have a `setToolTip(trans('...'))` call using an appropriate localized string key.
