const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const target = `  const toggleElement = (id: string) => {
    setElements(prev => prev.map(el => {
      if (el.id === id) {
        const nextActive = !el.active;
        const nextEnergy = nextActive ? Math.floor(82 + Math.random() * 18) : 0;
        
        if (nextActive) {
          addSystemLog(\`COMMAND_CENTER: Engaged '\${el.name}' core element. Status: active.\`);
          if (id === 'quantum') {
            onChangeTemperature(1.4);
            addSystemLog(\`COMMAND_CENTER: Quantum hyper-reasoning activated. Entropy adjusted to 1.4\`);
          }
        } else {
          addSystemLog(\`COMMAND_CENTER: Disengaged '\${el.name}' core element. Status: suspended.\`);
          if (id === 'quantum') onChangeTemperature(0.7);
        }

        return { ...el, active: nextActive, energy: nextEnergy };
      }
      return el;
    }));
  };`;

const replacement = `  const toggleElement = (id: string) => {
    setElements(prev => prev.map(el => {
      if (el.id === id) {
        const nextActive = !el.active;
        const nextEnergy = nextActive ? Math.floor(82 + Math.random() * 18) : 0;
        
        if (nextActive) {
          addSystemLog(\`COMMAND_CENTER: Engaged '\${el.name}' core element. Status: active.\`);
          if (id === 'quantum') {
            onChangeTemperature(1.4);
            addSystemLog(\`COMMAND_CENTER: Quantum hyper-reasoning activated. Entropy adjusted to 1.4\`);
          }
        } else {
          addSystemLog(\`COMMAND_CENTER: Disengaged '\${el.name}' core element. Status: suspended.\`);
          if (id === 'quantum') onChangeTemperature(0.7);
        }

        if (webhookUrl) {
          fetch('/api/webhook-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: webhookUrl, payload: { action: 'toggle_element', elementId: id, active: nextActive } })
          }).catch(e => console.error(e));
        }

        return { ...el, active: nextActive, energy: nextEnergy };
      }
      return el;
    }));
  };`;

if (!code.includes('action: \'toggle_element\'')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log("Patched elements");
}
