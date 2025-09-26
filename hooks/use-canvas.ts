// ./hooks/use-canvas.ts
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const useCanvas = () => {
  const createChart = (id: string, config: any) => {
    const ctx = (document.getElementById(id) as HTMLCanvasElement)?.getContext('2d');
    if (ctx) {
      return new Chart(ctx, config);
    }
  };

  return { createChart };
};