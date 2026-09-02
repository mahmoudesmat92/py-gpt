const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const effectTarget = `  useEffect(() => {
    // Start interval
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        newData.push({
          time,
          throughput: Math.floor(400 + Math.random() * 400),
          contextLoad: Math.floor(15 + Math.random() * 30),
          entropy: parseFloat((0.5 + Math.random() * 0.4).toFixed(2))
        });
        return newData;
      });`;

const effectReplacement = `  useEffect(() => {
    // Start interval
    const interval = setInterval(async () => {
      try {
        const start = performance.now();
        const res = await fetch("/api/os-metrics");
        const data = await res.json();
        const end = performance.now();
        setLatency(Math.round(end - start));
        
        setChartData(prev => {
          const newData = [...prev.slice(1)];
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          newData.push({
            time,
            throughput: data.cpuLoad * 10,
            contextLoad: data.memoryPct,
            entropy: parseFloat((0.5 + Math.random() * 0.4).toFixed(2))
          });
          return newData;
        });
      } catch (err) {
        // Fallback to random if no server
        setChartData(prev => {
          const newData = [...prev.slice(1)];
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          newData.push({
            time,
            throughput: Math.floor(400 + Math.random() * 400),
            contextLoad: Math.floor(15 + Math.random() * 30),
            entropy: parseFloat((0.5 + Math.random() * 0.4).toFixed(2))
          });
          return newData;
        });
      }
`;

code = code.replace(effectTarget, effectReplacement);

const newEffectTarget = `      // Random logs
      if (Math.random() > 0.6) {
        setLogs(prev => {
          const tpl = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
          const newLogs = [...prev, \`[\${new Date().toLocaleTimeString()}] \${tpl}\`];
          return newLogs.slice(-50);
        });
      }
    }, 2500);`;

const newEffectReplacement = `      // Random logs
      if (Math.random() > 0.6) {
        setLogs(prev => {
          const tpl = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
          const newLogs = [...prev, \`[\${new Date().toLocaleTimeString()}] \${tpl}\`];
          return newLogs.slice(-50);
        });
      }
    }, 2500);`;

code = code.replace(newEffectTarget, newEffectReplacement);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Patched dashboard effect");
