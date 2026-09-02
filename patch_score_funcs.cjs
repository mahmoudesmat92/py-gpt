const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreSheets.tsx', 'utf-8');

const targetTailscale = `  const runTailscaleRouter = () => {`;
const replTailscale = `  const runTailscaleRouter = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_tailscale' } })}).catch(()=>null);
    } catch(e) {}`;

const targetConn = `  const runConnectionsOptimize = () => {`;
const replConn = `  const runConnectionsOptimize = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_connections' } })}).catch(()=>null);
    } catch(e) {}`;

const targetPc = `  const runPcOptimization = () => {`;
const replPc = `  const runPcOptimization = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_pc_opt' } })}).catch(()=>null);
    } catch(e) {}`;

const targetMobile = `  const runMobileAuth = () => {`;
const replMobile = `  const runMobileAuth = () => {
    try {
      const webhookUrl = localStorage.getItem('mody_os_webhook_url');
      if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'score_mobile_auth' } })}).catch(()=>null);
    } catch(e) {}`;

if (!code.includes('action: \'score_tailscale\'')) {
  code = code.replace(targetTailscale, replTailscale)
             .replace(targetConn, replConn)
             .replace(targetPc, replPc)
             .replace(targetMobile, replMobile);
  fs.writeFileSync('src/components/ScoreSheets.tsx', code);
  console.log("Patched score functions");
}
