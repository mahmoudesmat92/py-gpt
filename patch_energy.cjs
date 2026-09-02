const fs = require('fs');
let code = fs.readFileSync('src/components/EnergyGrid.tsx', 'utf-8');

const target = `  const runSandboxScript = (scriptName: string) => {`;

const repl = `  const runSandboxScript = (scriptName: string) => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) {
        fetch('/api/webhook-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: webhookUrl, payload: { action: 'energy_sandbox_script', script: scriptName } })
        }).catch(()=>null);
      }
    } catch(e) {}`;

if (!code.includes('action: \'energy_sandbox_script\'')) {
  code = code.replace(target, repl);
  fs.writeFileSync('src/components/EnergyGrid.tsx', code);
  console.log("Patched EnergyGrid");
}
