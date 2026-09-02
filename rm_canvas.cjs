const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const startStr = `  // 3D Newell Neural Growth Canvas Simulation reflecting active session intelligence and parameters\n  useEffect(() => {\n    const canvas = canvasRef.current;`;

const endStr = `  }, [activeSession.modelId, activeSession.temperature, averageAciScore]);`;

const idx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr, idx);

if (idx !== -1 && endIdx !== -1) {
  let newCode = code.slice(0, idx) + code.slice(endIdx + endStr.length);
  fs.writeFileSync('src/components/Dashboard.tsx', newCode);
  console.log("Removed canvas useEffect");
} else {
  console.log("Could not find start or end");
}
