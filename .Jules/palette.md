## 2026-05-18 - Add ARIA labels to icon-only buttons
**Learning:** Icon-only QPushButton widgets in PySide6 applications must have tooltips assigned for screen reader accessibility and general UX. They lack implicit text labels.
**Action:** Always assign a localized string using setToolTip() on any QPushButton instantiated with an empty string label.
