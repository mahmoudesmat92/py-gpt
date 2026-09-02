const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreSheets.tsx', 'utf-8');

const target1 = `  const runFullAudit = () => {
    setIsAuditing(true);
    setScores(prev => prev.map(s => ({ ...s, score: 0 })));`;

const repl1 = `  const runFullAudit = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_audit' } })}).catch(()=>null);
    } catch(e) {}
    setIsAuditing(true);
    setScores(prev => prev.map(s => ({ ...s, score: 0 })));`;

const target2 = `  const resetScores = () => {
    setScores(initialScores);
  };`;

const repl2 = `  const resetScores = () => {
    setScores(initialScores);
  };`;

const target3 = `  const runPcOptimization = () => {
    setPcLoad(100);
    setTimeout(() => setPcLoad(12), 2000);
  };`;

const repl3 = `  const runPcOptimization = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_pc_opt' } })}).catch(()=>null);
    } catch(e) {}
    setPcLoad(100);
    setTimeout(() => setPcLoad(12), 2000);
  };`;

const target4 = `  const runMobileAuth = () => {
    setMobilePing(250);
    setTimeout(() => setMobilePing(42), 2000);
  };`;

const repl4 = `  const runMobileAuth = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_mobile_auth' } })}).catch(()=>null);
    } catch(e) {}
    setMobilePing(250);
    setTimeout(() => setMobilePing(42), 2000);
  };`;

const target5 = `  const runTailscaleRouter = () => {
    setTailscaleTx(850);
    setTimeout(() => setTailscaleTx(120), 2000);
  };`;

const repl5 = `  const runTailscaleRouter = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_tailscale' } })}).catch(()=>null);
    } catch(e) {}
    setTailscaleTx(850);
    setTimeout(() => setTailscaleTx(120), 2000);
  };`;

const target6 = `  const runConnectionsOptimize = () => {
    setConnections(0);
    setTimeout(() => setConnections(34), 2000);
  };`;

const repl6 = `  const runConnectionsOptimize = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_connections' } })}).catch(()=>null);
    } catch(e) {}
    setConnections(0);
    setTimeout(() => setConnections(34), 2000);
  };`;

if (!code.includes('action: \'score_audit\'')) {
  code = code.replace(target1, repl1).replace(target3, repl3).replace(target4, repl4).replace(target5, repl5).replace(target6, repl6);
  fs.writeFileSync('src/components/ScoreSheets.tsx', code);
  console.log("Patched ScoreSheets");
}
