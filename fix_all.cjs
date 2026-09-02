const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
dash = dash.replace(/<NeuralGraph3D [^>]+ \/>/, '<NeuralGraph3D intelligenceIndex={100} knowledgeNodes={500} synthesizedPathways={1200} modelColors={["#38bdf8", "#818cf8"]} />');
fs.writeFileSync('src/components/Dashboard.tsx', dash);

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/<Dashboard[\s\S]*?setActiveTab=\{setActiveTab\}\s*\/>/, '<Dashboard setActiveTab={setActiveTab} />');
fs.writeFileSync('src/App.tsx', app);

console.log("Fixed all");
