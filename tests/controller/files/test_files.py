#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ================================================== #
# This file is a part of PYGPT package               #
# Website: https://pygpt.net                         #
# GitHub:  https://github.com/szczyglis-dev/py-gpt   #
# MIT License                                        #
# Created By  : Marcin Szczygliński                  #
# Updated Date: 2025.08.03 14:00:00                  #
# ================================================== #

import os
from unittest.mock import MagicMock, call, patch

import PySide6

from pygpt_net.core.events import Event
from pygpt_net.item.ctx import CtxItem
from tests.mocks import mock_window
from pygpt_net.controller import Files


def test_touch_file_not_force(mock_window):
    """Test touch file (not force)"""
    files = Files(mock_window)
    mock_window.ui.dialog['create'] = MagicMock()

    files.touch_file('/test/path', 'test.txt', force=False)

    assert mock_window.ui.dialog['create'].id == 'touch'
    mock_window.ui.dialog['create'].input.setText.assert_called_once_with("")
    assert mock_window.ui.dialog['create'].current == '/test/path'
    mock_window.ui.dialog['create'].show.assert_called_once_with()
    mock_window.ui.dialog['create'].input.setFocus.assert_called_once_with()


@patch('builtins.open', new_callable=MagicMock)
def test_touch_file_force(mock_open, mock_window):
    """Test touch file (force)"""
    files = Files(mock_window)
    mock_window.ui.dialog['create'] = MagicMock()
    mock_window.update_status = MagicMock()
    files.update_explorer = MagicMock()

    files.touch_file('/test/path', 'test.txt', force=True)

    mock_window.ui.dialog['create'].close.assert_called_once_with()
    mock_open.assert_called_once_with(os.path.join('/test/path', 'test.txt'), 'a')
    mock_open.return_value.close.assert_called_once_with()

    mock_window.update_status.assert_called_once_with(
        f"[OK] Created file: {os.path.join('/test/path', 'test.txt')}"
    )
    files.update_explorer.assert_called_once_with()


@patch('builtins.open', side_effect=Exception('Test exception'))
def test_touch_file_exception(mock_open, mock_window):
    """Test touch file (exception)"""
    files = Files(mock_window)
    mock_window.ui.dialog['create'] = MagicMock()
    mock_window.core.debug.log = MagicMock()

    files.touch_file('/test/path', 'test.txt', force=True)

    mock_window.core.debug.log.assert_called_once()
    assert isinstance(mock_window.core.debug.log.call_args[0][0], Exception)


def test_delete(mock_window):
    """Test delete"""
    files = Files(mock_window)
    os.remove = MagicMock()

    files.delete('test', force=True)
    os.remove.assert_called_once_with('test')


def test_rename(mock_window):
    """Test rename"""
    files = Files(mock_window)
    mock_window.ui.dialog['rename'] = MagicMock()
    files.rename('test')
    assert mock_window.ui.dialog['rename'].id == 'output_file'
    assert mock_window.ui.dialog['rename'].current == 'test'


def test_update_name(mock_window):
    """Test update name"""
    files = Files(mock_window)
    os.rename = MagicMock()
    os.path.exists = MagicMock(return_value=False)
    mock_window.update_status = MagicMock()
    files.update_name('test', 'test2')
    os.rename.assert_called_once_with('test', os.path.join(os.path.dirname('test'), 'test2'))
    mock_window.ui.dialog['rename'].close.assert_called_once_with()


def test_open_dir(mock_window):
    """Test open dir"""
    files = Files(mock_window)
    files.open_in_file_manager = MagicMock()
    files.open_dir('test')
    files.open_in_file_manager.assert_called_once_with('test', False)


def test_open(mock_window):
    """Test open"""
    files = Files(mock_window)
    mock_window.core.platforms.is_snap = MagicMock(return_value=False)
    PySide6.QtGui.QDesktopServices.openUrl = MagicMock()
    files.open('test')
    PySide6.QtGui.QDesktopServices.openUrl.assert_called_once()


def test_open_in_file_manager(mock_window):
    """Test open in file manager"""
    files = Files(mock_window)
    files.open_in_file_manager = MagicMock()
    files.open_dir('test')
    files.open_in_file_manager.assert_called_once_with('test', False)
