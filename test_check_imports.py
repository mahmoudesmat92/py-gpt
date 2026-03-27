import re
import os

files = [
    'src/pygpt_net/ui/layout/toolbox/presets.py',
    'src/pygpt_net/ui/layout/toolbox/assistants.py',
    'src/pygpt_net/ui/dialog/assistant.py',
    'src/pygpt_net/ui/dialog/remote_store.py',
    'src/pygpt_net/ui/widget/filesystem/explorer.py',
    'src/pygpt_net/ui/dialog/preset.py',
    'src/pygpt_net/ui/layout/chat/attachments_ctx.py'
]
for f in files:
    with open(f, 'r') as file:
        content = file.read()
        if 'import Qt' not in content and ' Qt,' not in content and ', Qt' not in content:
            print(f"Missing Qt import in {f}")
