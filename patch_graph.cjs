const fs = require('fs');
let code = fs.readFileSync('src/components/NeuralGraph3D.tsx', 'utf-8');

const targetMemo = `  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Cap visual nodes so we don't kill the browser
    const numNodes = Math.min(200, Math.floor(knowledgeNodes / 10));
    const numLinks = Math.min(300, Math.floor(synthesizedPathways / 5));

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        id: i,
        color: modelColors[Math.floor(Math.random() * modelColors.length)],
        val: 1 + Math.random() * 2
      });
    }

    for (let i = 0; i < numLinks; i++) {
      const source = Math.floor(Math.random() * numNodes);
      let target = Math.floor(Math.random() * numNodes);
      while (target === source && numNodes > 1) {
        target = Math.floor(Math.random() * numNodes);
      }
      links.push({
        source,
        target,
        color: modelColors[Math.floor(Math.random() * modelColors.length)]
      });
    }

    return { nodes, links };
  }, [knowledgeNodes, synthesizedPathways, modelColors]);`;

const replMemo = `  // Keep nodes and links stateful so it doesn't scramble on updates
  const [graphData, setGraphData] = useState({ nodes: [] as any[], links: [] as any[] });

  useEffect(() => {
    setGraphData(prev => {
      const newNodes = [...prev.nodes];
      const newLinks = [...prev.links];
      
      const targetNodes = Math.min(300, Math.floor(knowledgeNodes / 10));
      const targetLinks = Math.min(400, Math.floor(synthesizedPathways / 5));

      if (targetNodes > newNodes.length) {
        for (let i = newNodes.length; i < targetNodes; i++) {
          newNodes.push({
            id: i,
            color: modelColors[Math.floor(Math.random() * modelColors.length)],
            val: 1 + Math.random() * 2
          });
        }
      }

      if (targetLinks > newLinks.length && newNodes.length > 1) {
        for (let i = newLinks.length; i < targetLinks; i++) {
          const source = Math.floor(Math.random() * newNodes.length);
          let target = Math.floor(Math.random() * newNodes.length);
          while (target === source) {
            target = Math.floor(Math.random() * newNodes.length);
          }
          newLinks.push({
            source,
            target,
            color: modelColors[Math.floor(Math.random() * modelColors.length)]
          });
        }
      }

      return { nodes: newNodes, links: newLinks };
    });
  }, [knowledgeNodes, synthesizedPathways, modelColors]);`;

code = code.replace(targetMemo, replMemo);
fs.writeFileSync('src/components/NeuralGraph3D.tsx', code);
console.log("Patched Graph Memo");
