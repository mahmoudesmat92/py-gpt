## 2025-04-07 - Add tooltips to icon-only buttons
**Learning:** Found several `QPushButton` instances configured with `QIcon` but missing tooltips, creating poor accessibility for screen readers and new users.
**Action:** Used `.setToolTip(trans('...'))` for missing buttons in the toolbox UI and file explorer, ensuring `trans()` localization is applied. In the future, actively look for `QPushButton(QIcon(...), "")` pattern as a quick a11y win.
