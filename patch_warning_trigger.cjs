const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const target = `  const isWarning = lastMetric && (lastMetric.throughput > 850 || lastMetric.contextLoad > 85);`;

const replacement = `  const isWarning = lastMetric && (lastMetric.throughput > 850 || lastMetric.contextLoad > 85);

  useEffect(() => {
    if (isWarning && webhookUrl) {
      addSystemLog("SYSTEM WARNING: Thresholds exceeded. Triggering emergency n8n Webhook...");
      fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, payload: { action: 'system_warning', throughput: lastMetric.throughput, cpu: lastMetric.cpuLoad } })
      }).catch(e => console.error(e));
    }
  }, [isWarning, webhookUrl]);`;

if (!code.includes('SYSTEM WARNING: Thresholds exceeded.')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Patched isWarning trigger");
}
