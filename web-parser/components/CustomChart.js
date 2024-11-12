import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function CustomChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Hapus grafik sebelumnya jika sudah ada
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Membuat data dan konfigurasi untuk Chart.js
    const chartData = {
      labels: data.map((item) => new Date(item.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: "Temperature (°C)",
          data: data.map((item) => item.suhu),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
        {
          label: "Humidity (%)",
          data: data.map((item) => item.humid),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    };

    const config = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "minute",
            },
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

    // Membersihkan grafik ketika komponen di-unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
}
