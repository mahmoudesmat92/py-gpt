const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/catch \(err\) \{/g, 'catch (err: any) {');
fs.writeFileSync('server.ts', code);
