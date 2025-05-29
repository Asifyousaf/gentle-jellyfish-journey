
// Chart management utilities for trends
export class ChartManager {
  constructor() {
    this.charts = new Map();
  }

  createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    const chart = new Chart(canvas, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  destroyChart(canvasId) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }
  }

  updateChart(canvasId, newData) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.data = newData;
      chart.update();
    }
  }

  destroyAllCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }
}
