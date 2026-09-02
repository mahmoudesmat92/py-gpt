const fs = require('fs');
let code = fs.readFileSync('src/components/DiagnosticsSuite.tsx', 'utf-8');

const target1 = `  const handleRunSystemScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(['Initializing deep system diagnostic sweep...']);`;

const repl1 = `  const handleRunSystemScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(['Initializing deep system diagnostic sweep...']);
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'diagnostic_scan' } })}).catch(()=>null);
    } catch(e) {}`;

const target2 = `  const handleSelfRepair = () => {
    if (modules.every(m => m.health === 100)) return;
    setIsRepairing(true);`;

const repl2 = `  const handleSelfRepair = () => {
    if (modules.every(m => m.health === 100)) return;
    setIsRepairing(true);
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'diagnostic_repair_all' } })}).catch(()=>null);
    } catch(e) {}`;

const target3 = `  const handleRepairModule = (index: number) => {
    setModules(prev => prev.map((m, i) => {
      if (i === index && m.health < 100) {`;

const repl3 = `  const handleRepairModule = (index: number) => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'diagnostic_repair_module', moduleIndex: index } })}).catch(()=>null);
    } catch(e) {}
    setModules(prev => prev.map((m, i) => {
      if (i === index && m.health < 100) {`;

if (!code.includes('action: \'diagnostic_scan\'')) {
  code = code.replace(target1, repl1).replace(target2, repl2).replace(target3, repl3);
  fs.writeFileSync('src/components/DiagnosticsSuite.tsx', code);
  console.log("Patched DiagnosticsSuite");
}
