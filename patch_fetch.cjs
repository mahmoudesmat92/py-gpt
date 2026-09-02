const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/const data = await res.json\(\);/g, `
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON response: " + text.slice(0, 50));
      }
  `);
  code = code.replace(/const data = await response.json\(\);/g, `
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid JSON response: " + text.slice(0, 50));
        }
  `);
  fs.writeFileSync(file, code);
}

patchFile('src/components/HardwareTelemetry.tsx');
patchFile('src/components/Dashboard.tsx');
patchFile('src/components/SkillsAssetsSuite.tsx');
patchFile('src/components/ChatWindow.tsx');
patchFile('src/App.tsx');
console.log("Patched JSON parsing");
