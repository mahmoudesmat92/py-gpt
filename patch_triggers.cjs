const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const target1 = `  const triggerNeuralSeed = () => {
    setKnowledgeNodes(prev => prev + 250);
    setSynthesizedPathways(prev => prev + 15);
    addSystemLog(\`COMMAND_CENTER: Dispatched direct neural concept seed cluster injection. (+250 Nodes, +15 Pathways)\`);
  };`;

const repl1 = `  const triggerNeuralSeed = () => {
    setKnowledgeNodes(prev => prev + 250);
    setSynthesizedPathways(prev => prev + 15);
    addSystemLog(\`COMMAND_CENTER: Dispatched direct neural concept seed cluster injection. (+250 Nodes, +15 Pathways)\`);
    if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'trigger_neural_seed' } })}).catch(()=>null);
  };`;

const target2 = `  const triggerFlushVRAM = () => {
    setLatency(65);
    addSystemLog(\`COMMAND_CENTER: Memory bus flush complete. Purged inactive context frames. Response latency reduced to 65ms.\`);
  };`;

const repl2 = `  const triggerFlushVRAM = () => {
    setLatency(65);
    addSystemLog(\`COMMAND_CENTER: Memory bus flush complete. Purged inactive context frames. Response latency reduced to 65ms.\`);
    if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'trigger_flush_vram' } })}).catch(()=>null);
  };`;

const target3 = `  const triggerOverclock = () => {
    onChangeTemperature(1.6);
    addSystemLog(\`COMMAND_CENTER: Overclocked system entropy coefficient to 1.6 (MAX_CREATIVITY).\`);
  };`;

const repl3 = `  const triggerOverclock = () => {
    onChangeTemperature(1.6);
    addSystemLog(\`COMMAND_CENTER: Overclocked system entropy coefficient to 1.6 (MAX_CREATIVITY).\`);
    if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'trigger_overclock' } })}).catch(()=>null);
  };`;

const target4 = `  const triggerGroundingIndex = () => {
    addSystemLog(\`COMMAND_CENTER: Performing real-time semantic grounding check across Google search indices...\`);
    setTimeout(() => {
      addSystemLog(\`COMMAND_CENTER: Grounding sync complete. 12 fresh document coordinates indexed into primary buffer.\`);
    }, 1500);
  };`;

const repl4 = `  const triggerGroundingIndex = () => {
    addSystemLog(\`COMMAND_CENTER: Performing real-time semantic grounding check across Google search indices...\`);
    if (webhookUrl) fetch('/api/webhook-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: webhookUrl, payload: { action: 'trigger_grounding_index' } })}).catch(()=>null);
    setTimeout(() => {
      addSystemLog(\`COMMAND_CENTER: Grounding sync complete. 12 fresh document coordinates indexed into primary buffer.\`);
    }, 1500);
  };`;

if (!code.includes('action: \'trigger_neural_seed\'')) {
  code = code.replace(target1, repl1).replace(target2, repl2).replace(target3, repl3).replace(target4, repl4);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Patched triggers");
}
