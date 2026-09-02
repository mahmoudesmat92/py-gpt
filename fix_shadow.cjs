const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/const text = await res\.text\(\);/g, `const rawText = await res.text();`);
  code = code.replace(/JSON\.parse\(text\)/g, `JSON.parse(rawText)`);
  code = code.replace(/text\.slice\(0, 50\)/g, `rawText.slice(0, 50)`);

  code = code.replace(/const text = await response\.text\(\);/g, `const rawText = await response.text();`);
  
  fs.writeFileSync(file, code);
}

patchFile('src/components/HardwareTelemetry.tsx');
patchFile('src/components/Dashboard.tsx');
patchFile('src/components/SkillsAssetsSuite.tsx');
patchFile('src/components/ChatWindow.tsx');
patchFile('src/App.tsx');
console.log("Patched JSON parsing variable shadow");
