## 2024-05-19 - Accessibility for Icon-only Buttons
**Learning:** Found multiple instances where icon-only buttons (like settings or add buttons in toolbox UI) lacked `setToolTip`. Screen readers rely on tooltips or accessible names to announce buttons that don't have visible text labels.
**Action:** Consistently add `setToolTip` to all icon-only buttons in PySide6/Qt UIs to ensure they have an accessible name, reusing existing localization strings.
