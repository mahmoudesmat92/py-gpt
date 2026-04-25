## 2026-04-25 - Icon-only Buttons Need Tooltips
**Learning:** Several tool buttons within layout/toolbox were missing tooltips despite having icons. Qt's `QPushButton(QIcon, "")` constructor doesn't automatically imply an accessible label.
**Action:** Whenever creating a button without text (icon-only), always explicitly chain a `.setToolTip()` using an appropriate localization string (via `trans()`) to ensure screen readers and confused users have context.
