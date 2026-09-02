const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsAssetsSuite.tsx', 'utf-8');

const importStr = `import HardwareTelemetry from './HardwareTelemetry';\n`;

code = code.replace(`import Markdown from 'react-markdown';`, `import Markdown from 'react-markdown';\n${importStr}`);
fs.writeFileSync('src/components/SkillsAssetsSuite.tsx', code);
console.log("Patched import");
