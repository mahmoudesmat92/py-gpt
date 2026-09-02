const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const targetUseEffectStart = `  // 3D Newell Neural Growth Canvas Simulation reflecting active session intelligence and parameters
  useEffect(() => {
    const canvas = canvasRef.current;`;

const modelWeightFunc = `  // Calculate Dynamic Intelligence Index
  const getModelWeight = (id: string) => {
    switch (id) {
      case 'gemini-3.1-pro-preview': return 98;
      case 'gemini-3.5-flash': return 82;
      case 'gemini-3.1-flash-lite': return 65;
      case 'gemini-3.1-flash-lite-image': return 72;
      default: return 80;
    }
  };
  const modelWeight = getModelWeight(activeSession.modelId);
  const intelligenceIndex = Math.round((modelWeight * 0.4) + (averageAciScore * 0.6));

  // Dynamic color palette based on active neural core model selection
  let colors = ['#38bdf8', '#818cf8', '#22d3ee', '#60a5fa']; // Default blue-cyan
  if (activeSession.modelId === 'gemini-3.1-pro-preview') {
    colors = ['#c084fc', '#a78bfa', '#818cf8', '#38bdf8', '#e879f9']; // Reasoning Purple / Royal Indigo
  } else if (activeSession.modelId === 'gemini-3.1-flash-lite') {
    colors = ['#fbbf24', '#f59e0b', '#f97316', '#38bdf8']; // Fast Core Amber / Orange
  } else if (activeSession.modelId === 'gemini-3.1-flash-lite-image') {
    colors = ['#ec4899', '#f43f5e', '#fb7185', '#a78bfa']; // Image Gen Magenta / Rose
  }

  // 3D Newell Neural Growth Canvas Simulation reflecting active session intelligence and parameters
  useEffect(() => {
    const canvas = canvasRef.current;`;

code = code.replace(targetUseEffectStart, modelWeightFunc);

const removeVars = `    // Calculate Dynamic Intelligence Index
    const getModelWeight = (id: string) => {
      switch (id) {
        case 'gemini-3.1-pro-preview': return 98;
        case 'gemini-3.5-flash': return 82;
        case 'gemini-3.1-flash-lite': return 65;
        case 'gemini-3.1-flash-lite-image': return 72;
        default: return 80;
      }
    };
    const modelWeight = getModelWeight(activeSession.modelId);
    const intelligenceIndex = Math.round((modelWeight * 0.4) + (averageAciScore * 0.6));

    // Dynamic node count based on intelligence: ranges from 24 to 68 nodes
    const particleCount = Math.floor(24 + (intelligenceIndex - 50) * 0.85);

    // Dynamic color palette based on active neural core model selection
    let colors = ['#38bdf8', '#818cf8', '#22d3ee', '#60a5fa']; // Default blue-cyan
    if (activeSession.modelId === 'gemini-3.1-pro-preview') {
      colors = ['#c084fc', '#a78bfa', '#818cf8', '#38bdf8', '#e879f9']; // Reasoning Purple / Royal Indigo
    } else if (activeSession.modelId === 'gemini-3.1-flash-lite') {
      colors = ['#fbbf24', '#f59e0b', '#f97316', '#38bdf8']; // Fast Core Amber / Orange
    } else if (activeSession.modelId === 'gemini-3.1-flash-lite-image') {
      colors = ['#ec4899', '#f43f5e', '#fb7185', '#a78bfa']; // Image Gen Magenta / Rose
    }`;

const replVars = `    // Dynamic node count based on intelligence: ranges from 24 to 68 nodes
    const particleCount = Math.floor(24 + (intelligenceIndex - 50) * 0.85);`;

code = code.replace(removeVars, replVars);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Patched Scope");
