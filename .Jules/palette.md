## 2026-08-06 - Add Tooltips to Icon-Only Buttons
**Learning:** In PySide6/Qt UIs, icon-only buttons instantiated with `QPushButton(QIcon, "")` are inaccessible to screen readers without a tooltip. The pattern in this app is to use `trans('key')` from `pygpt_net.utils` for localized tooltips.
**Action:** Always add `setToolTip(trans('...'))` to icon-only buttons to ensure they have an accessible name, referencing existing localization keys in `locale.en.ini` whenever possible.
