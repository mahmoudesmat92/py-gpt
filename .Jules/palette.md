## 2024-05-19 - Add tooltips to icon-only buttons in PyGPT PySide6 UI
**Learning:** PySide6 UI components like QPushButton using only icons (QIcon) need explicit `.setToolTip()` assignments to be properly identified by screen readers and to aid visual discovery. Unlike text buttons, they don't have implicit labels.
**Action:** Always check if a QPushButton instantiated with only a QIcon has a `.setToolTip()` call using the appropriate `trans()` locale key when creating or reviewing PySide6 interfaces.
