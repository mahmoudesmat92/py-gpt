import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

interface NeuralGraph3DProps {
  knowledgeNodes: number;
  synthesizedPathways: number;
  intelligenceIndex?: number;
  modelColors: string[];
}

export default function NeuralGraph3D({ knowledgeNodes, synthesizedPathways, intelligenceIndex: _intelligenceIndex, modelColors }: NeuralGraph3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 270 });
  const graphRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep nodes and links stateful so it doesn't scramble on updates
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
  }, [knowledgeNodes, synthesizedPathways, modelColors]);

  useEffect(() => {
    if (graphRef.current) {
      // Rotate the graph slowly
      let angle = 0;
      const interval = setInterval(() => {
        if (graphRef.current) {
          angle += Math.PI / 800;
          graphRef.current.cameraPosition({
            x: 200 * Math.sin(angle),
            z: 200 * Math.cos(angle)
          });
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [graphRef.current]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph3D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeColor="color"
        nodeRelSize={4}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkWidth={1}
        enableNodeDrag={false}
        enableNavigationControls={true}
        showNavInfo={false}
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  );
}
