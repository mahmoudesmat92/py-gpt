## 2025-05-20 - Added tooltips to icon-only add buttons in Presets and Assistants lists
**Learning:** Found that the main add buttons in the Presets and Assistants toolbox layouts are icon-only. Screen readers cannot accurately describe them, resulting in poor accessibility, and users without screen readers lack a text hint on hover.
**Action:** Always add .setToolTip(trans(...)) for QPushButton objects when their text string is empty.
