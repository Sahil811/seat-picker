import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const useZoom = (containerRef: React.RefObject<SVGSVGElement | null>) => {
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = d3.select(containerRef.current);
    const g = svg.select('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    return () => {
      svg.on('.zoom', null);
    };
  }, [containerRef]);

  return { zoomRef };
};