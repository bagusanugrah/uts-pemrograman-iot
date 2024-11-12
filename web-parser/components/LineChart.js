// components/LineChart.js
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function LineChart({ labels, data, label, color }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Hapus grafik sebelumnya jika sudah ada
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Membuat data dan konfigurasi untuk Chart.js
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          backgroundColor: color,
          fill: false,
        },
      ],
    };

    const config = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: label,
          },
        },
        scales: {
          x: {
            display: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    // Buat grafik baru
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, config);

    // Bersihkan grafik saat komponen di-unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, data, label, color]);

  return <canvas ref={chartRef}></canvas>;
}
