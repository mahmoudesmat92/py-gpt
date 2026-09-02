const fs = require('fs');

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
code = code.replace('<NeuralGraph3D intelligenceIndex={100} />', '<NeuralGraph3D intelligenceIndex={100} knowledgeNodes={[]} synthesizedPathways={[]} modelColors={{}} />');

fs.writeFileSync('src/components/Dashboard.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(/import \{ LayoutDashboard, MessageSquare, FileText, Brush, Settings, Compass, Zap, Activity, FolderSync, Award, SquareTerminal \} from 'lucide-react';/, "import { Settings } from 'lucide-react';");

appCode = appCode.replace(/import Painter from '\.\/components\/Painter';\n/, '');
appCode = appCode.replace(/import TacticalSuite from '\.\/components\/TacticalSuite';\n/, '');
appCode = appCode.replace(/import EnergyGrid from '\.\/components\/EnergyGrid';\n/, '');
appCode = appCode.replace(/import ScoreSheets from '\.\/components\/ScoreSheets';\n/, '');

appCode = appCode.replace(/onDeleteSession=\{handleDeleteSession\}\n/, 'onDeleteSession={handleDeleteSession}\n              onSelectModel={(id: string) => {}}\n              onSelectPreset={(id: string) => {}}\n              onChangeTemperature={(temp: number) => {}}\n              onSendMessage={(text: string) => {}}\n');
fs.writeFileSync('src/App.tsx', appCode);

console.log("Fixed dashboard and app TS issues");
