const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsAssetsSuite.tsx', 'utf-8');

const targetName = `{activeTab === 'workspace' 
                  ? (selectedWorkspaceFile?.name || 'Select a Workspace file')
                  : (selectedLocalFile?.name || 'Select a PC file')
                }`;

const targetPath = `{activeTab === 'workspace'
                  ? (selectedWorkspaceFile?.path || 'No file active')
                  : (selectedLocalFile?.path || 'No file active')
                }`;

code = code.replace(targetName, `{activeTab === 'workspace' 
                  ? (selectedWorkspaceFile?.name || 'Select a Workspace file')
                  : activeTab === 'pc' ? (selectedLocalFile?.name || 'Select a PC file')
                  : 'Hardware Sync Telemetry'
                }`);

code = code.replace(targetPath, `{activeTab === 'workspace'
                  ? (selectedWorkspaceFile?.path || 'No file active')
                  : activeTab === 'pc' ? (selectedLocalFile?.path || 'No file active')
                  : 'Connected to local host systeminformation service'
                }`);

fs.writeFileSync('src/components/SkillsAssetsSuite.tsx', code);
console.log("Patched header");
