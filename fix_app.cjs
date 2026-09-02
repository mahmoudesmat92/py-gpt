const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// There might be unused imports causing lint errors.
const unusedImports = [
  'LayoutDashboard', 'MessageSquare', 'FileText', 'Brush', 'Settings', 'Compass', 'Zap', 'Activity', 'FolderSync', 'Award', 'SquareTerminal',
  'ChatWindow', 'ConfigPanel', 'Painter', 'Notepad', 'TacticalSuite', 'EnergyGrid', 'DiagnosticsSuite', 'SkillsAssetsSuite', 'ScoreSheets',
  'SystemToast'
];

unusedImports.forEach(imp => {
  code = code.replace(new RegExp(\`import [^;]*\${imp}[^;]*;\\n?\`, 'g'), '');
});

fs.writeFileSync('src/App.tsx', code);
