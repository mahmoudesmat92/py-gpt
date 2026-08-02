import sys
from PySide6.QtWidgets import QApplication, QPushButton
from PySide6.QtGui import QIcon

def test():
    app = QApplication(sys.argv)
    btn = QPushButton(QIcon(":/icons/add.svg"), "")
    btn.setToolTip("Create")
    print(btn.toolTip())

test()
