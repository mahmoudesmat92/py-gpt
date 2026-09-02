const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const target = `  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setChartData(generateChartData());
      setLogs(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] MANUAL_SYNC: Refreshed system matrices, score card & telemetry context.\`]);
    }, 1000);
  };`;

const replacement = `  const handleSyncData = () => {
    setIsSyncing(true);
    
    // Also ping n8n
    if (webhookUrl) {
      fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, payload: { action: 'manual_sync', timestamp: Date.now() } })
      }).catch(e => console.error(e));
    }

    setTimeout(() => {
      setIsSyncing(false);
      setChartData(generateChartData());
      setLogs(prev => [...prev, \`[\${new Date().toLocaleTimeString()}] MANUAL_SYNC: Refreshed system matrices, score card & telemetry context.\`]);
    }, 1000);
  };`;

if (!code.includes('action: \'manual_sync\'')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Patched sync");
}
