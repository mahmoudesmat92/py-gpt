## $(date +%Y-%m-%d) - Added tooltips to icon-only buttons
**Learning:** Icon-only buttons (like QPushButton(QIcon, "")) lack accessibility descriptions and tooltips in standard PySide6 components. Using localized tooltips is an effective micro-UX pattern to provide context.
**Action:** Always add setToolTip(trans('...')) for icon-only buttons created without label text.
