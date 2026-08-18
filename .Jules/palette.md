## 2026-08-18 - Missing tooltips on icon-only buttons
**Learning:** In PySide6, creating icon-only buttons with empty string text removes the accessible name for screen readers.
**Action:** Always add setToolTip(trans(...)) when instantiating QPushButton with an empty string.
