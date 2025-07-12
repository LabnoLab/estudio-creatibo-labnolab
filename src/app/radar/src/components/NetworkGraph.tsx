'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { TrendAnalysis } from '@/types/analysis';

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  analysis: TrendAnalysis;
  tags: string[];
  impact: number;
  sector: string;
  color: string;
  size: number;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  strength: number;
  sharedTags: string[];
}

interface NetworkGraphProps {
  analyses: Array<{
    id: string;
    title: string;
    analysis_data: TrendAnalysis;
    created_at: string;
  }>;
}

const SECTOR_COLORS = {
  'Tecnología': '#00ff88',
  'Economía': '#00d4ff',
  'Sociedad': '#ff6b6b',
  'Política': '#ffd93d',
  'Salud': '#6bcf7f',
  'Educación': '#a8e6cf',
  'Medio Ambiente': '#4ecdc4',
  'Seguridad': '#ff8a80',
  'Defecto': '#94a3b8'
};

export default function NetworkGraph({ analyses }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Generar datos mock si no hay análisis reales
  const getMockData = (): NetworkNode[] => {
    const mockAnalyses = [
      {
        id: 'mock-1',
        title: 'IA Generativa en Educación',
        tags: ['IA', 'Educación', 'Innovación'],
        sector: 'Tecnología',
        impact: 85
      },
      {
        id: 'mock-2', 
        title: 'Criptomonedas y Regulación',
        tags: ['Blockchain', 'Economía', 'Regulación'],
        sector: 'Economía',
        impact: 72
      },
      {
        id: 'mock-3',
        title: 'Trabajo Remoto Post-Pandemia',
        tags: ['Trabajo', 'Sociedad', 'Tecnología'],
        sector: 'Sociedad',
        impact: 68
      },
      {
        id: 'mock-4',
        title: 'Energías Renovables',
        tags: ['Sostenibilidad', 'Innovación', 'Economía'],
        sector: 'Medio Ambiente',
        impact: 90
      },
      {
        id: 'mock-5',
        title: 'Telemedicina y Salud Digital',
        tags: ['Salud', 'Tecnología', 'Innovación'],
        sector: 'Salud',
        impact: 78
      },
      {
        id: 'mock-6',
        title: 'Ciberseguridad Nacional',
        tags: ['Seguridad', 'Tecnología', 'Gobierno'],
        sector: 'Seguridad',
        impact: 88
      }
    ];

    return mockAnalyses.map(mock => ({
      id: mock.id,
      title: mock.title,
      analysis: {} as TrendAnalysis,
      tags: mock.tags,
      impact: mock.impact,
      sector: mock.sector,
      color: SECTOR_COLORS[mock.sector as keyof typeof SECTOR_COLORS] || SECTOR_COLORS.Defecto,
      size: Math.max(20, mock.impact / 3)
    }));
  };

  // Calcular conexiones entre nodos basadas en tags compartidos
  const calculateLinks = (nodes: NetworkNode[]): NetworkLink[] => {
    const links: NetworkLink[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        const sharedTags = nodeA.tags.filter(tag => 
          nodeB.tags.some(otherTag => 
            otherTag.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(otherTag.toLowerCase())
          )
        );

        if (sharedTags.length > 0) {
          links.push({
            source: nodeA.id,
            target: nodeB.id,
            strength: sharedTags.length * 10,
            sharedTags
          });
        }
      }
    }

    return links;
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(600, rect.height - 100)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = getMockData();
    const links = calculateLinks(nodes);

    // Configurar simulación de fuerzas
    const simulation = d3.forceSimulation<NetworkNode>(nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links)
        .id(d => d.id)
        .distance(100)
        .strength(link => link.strength / 100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius((d: d3.SimulationNodeDatum) => (d as NetworkNode).size + 5));

    // Crear gradientes para los nodos
    const defs = svg.append('defs');
    
    nodes.forEach(node => {
      const gradient = defs.append('radialGradient')
        .attr('id', `gradient-${node.id}`)
        .attr('cx', '30%')
        .attr('cy', '30%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', node.color)
        .attr('stop-opacity', 0.8);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', node.color)
        .attr('stop-opacity', 0.3);
    });

    // Crear contenedor con zoom
    const container = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Dibujar conexiones
    const linkElements = container.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#334155')
      .attr('stroke-width', (d: NetworkLink) => Math.sqrt(d.strength / 5))
      .attr('stroke-opacity', 0.6);

    // Dibujar nodos
    const nodeElements = container.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Círculos de los nodos con gradiente
    nodeElements.append('circle')
      .attr('r', (d: NetworkNode) => d.size)
      .attr('fill', (d: NetworkNode) => `url(#gradient-${d.id})`)
      .attr('stroke', (d: NetworkNode) => d.color)
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d: NetworkNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.size * 1.2)
          .attr('stroke-width', 3);
        
        // Destacar conexiones
        linkElements
          .style('stroke-opacity', (link: NetworkLink) => 
            (link.source as NetworkNode).id === d.id || (link.target as NetworkNode).id === d.id ? 1 : 0.1
          );
      })
      .on('mouseout', function(event, d: NetworkNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.size)
          .attr('stroke-width', 2);
        
        linkElements.style('stroke-opacity', 0.6);
      })
      .on('click', (event, d: NetworkNode) => {
        setSelectedNode(d);
      });

    // Etiquetas de los nodos
    nodeElements.append('text')
      .text((d: NetworkNode) => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', (d: NetworkNode) => d.size + 15)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

    // Drag functionality
    const drag = d3.drag<SVGGElement, NetworkNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeElements.call(drag);

    // Actualizar posiciones en cada tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: NetworkLink) => (d.source as NetworkNode).x!)
        .attr('y1', (d: NetworkLink) => (d.source as NetworkNode).y!)
        .attr('x2', (d: NetworkLink) => (d.target as NetworkNode).x!)
        .attr('y2', (d: NetworkLink) => (d.target as NetworkNode).y!);

      nodeElements.attr('transform', (d: NetworkNode) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };

  }, [dimensions, analyses]);

  return (
    <div className="h-full bg-slate-900/50 rounded-xl border border-slate-700/30 overflow-hidden">
      <div className="h-full relative">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
        />
        
        {/* Panel de información del nodo seleccionado */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-72 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white truncate">
                {selectedNode.title}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400">Sector:</span>
                <div 
                  className="inline-block ml-2 px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: selectedNode.color + '20', color: selectedNode.color }}
                >
                  {selectedNode.sector}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-slate-400">Impacto:</span>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-slate-700 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${selectedNode.impact}%`,
                        backgroundColor: selectedNode.color 
                      }}
                    />
                  </div>
                  <span className="text-sm text-white font-medium">{selectedNode.impact}%</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-slate-400">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Controles de zoom */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <button
            onClick={() => {
              if (svgRef.current) {
                const svg = d3.select(svgRef.current);
                svg.transition().duration(750).call(
                  d3.zoom<SVGSVGElement, unknown>().transform,
                  d3.zoomIdentity.scale(1).translate(0, 0)
                );
              }
            }}
            className="px-3 py-2 bg-slate-800/80 backdrop-blur-sm text-slate-300 text-sm rounded-lg hover:bg-slate-700/80 hover:text-white transition-all duration-300 border border-slate-600/50"
          >
            Reset Zoom
          </button>
        </div>

        {/* Leyenda de sectores */}
        <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Sectores</h4>
          <div className="space-y-2">
            {Object.entries(SECTOR_COLORS).slice(0, -1).map(([sector, color]) => (
              <div key={sector} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-slate-300">{sector}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 