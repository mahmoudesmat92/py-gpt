## 2025-01-20 - Add tooltips to icon-only buttons
**Learning:** Found several PySide6/Qt icon-only buttons (`QPushButton(QIcon, "")`) across different UI files that lacked descriptive tooltips, making them inaccessible for screen readers and confusing for sighted users.
**Action:** Applied `setToolTip(trans('...'))` to the identified instances of icon-only buttons. The key translation strings were extracted directly from the existing `locale.en.ini` file.
