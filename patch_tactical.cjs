const fs = require('fs');
let code = fs.readFileSync('src/components/TacticalSuite.tsx', 'utf-8');

const target1 = `  const handleInterceptTarget = (id: string) => {
    addCommLog(\`SYSTEM: Targeting laser ready for device \${id}.\`);
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        addCommLog(\`SYSTEM: Laser started. Device \${t.name} status changed to ACTIVE.\`);
        return { ...t, status: 'ACTIVE' };
      }
      return t;
    }));
  };`;

const repl1 = `  const handleInterceptTarget = (id: string) => {
    addCommLog(\`SYSTEM: Targeting laser ready for device \${id}.\`);
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'tactical_laser', targetId: id } })}).catch(()=>null);
    } catch(e) {}
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        addCommLog(\`SYSTEM: Laser started. Device \${t.name} status changed to ACTIVE.\`);
        return { ...t, status: 'ACTIVE' };
      }
      return t;
    }));
  };`;

const target2 = `  const handleShieldTarget = (id: string) => {
    addCommLog(\`SYSTEM: Deploying defensive shield around \${id}.\`);
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        addCommLog(\`SYSTEM: Shield active for \${t.name}.\`);
        return { ...t, status: 'SECURED' };
      }
      return t;
    }));
  };`;

const repl2 = `  const handleShieldTarget = (id: string) => {
    addCommLog(\`SYSTEM: Deploying defensive shield around \${id}.\`);
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'tactical_shield', targetId: id } })}).catch(()=>null);
    } catch(e) {}
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        addCommLog(\`SYSTEM: Shield active for \${t.name}.\`);
        return { ...t, status: 'SECURED' };
      }
      return t;
    }));
  };`;

if (!code.includes('action: \'tactical_laser\'')) {
  code = code.replace(target1, repl1).replace(target2, repl2);
  fs.writeFileSync('src/components/TacticalSuite.tsx', code);
  console.log("Patched tactical");
}
