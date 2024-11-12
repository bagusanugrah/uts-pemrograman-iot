// pages/seluruh-data.js
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import LineChart from "../components/LineChart";
import Head from "next/head";

export default function SeluruhData() {
  const [data, setData] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [brightnessData, setBrightnessData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/seluruh-data/").then((response) => {
      setData(response.data);

      // Extract data for the charts
      const temps = response.data.map((item) => item.temperature);
      const humids = response.data.map((item) => item.humidity);
      const brights = response.data.map((item) => item.brightness);
      const timeLabels = response.data.map((item) =>
        new Date(item.timestamp).toLocaleString()
      );

      setTemperatureData(temps);
      setHumidityData(humids);
      setBrightnessData(brights);
      setTimestamps(timeLabels);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Seluruh Data Sensor</title>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Seluruh Data</h1>
        <div className="bg-white shadow-md rounded p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Grafik Suhu, Kelembapan, dan Kecerahan</h2>
          
          {/* Tampilan Grafik dalam Kolom Vertikal */}
          <div className="flex flex-col gap-8">
            <LineChart labels={timestamps} data={temperatureData} label="Suhu (°C)" color="rgba(75,192,192,1)" />
            <LineChart labels={timestamps} data={humidityData} label="Kelembapan (%)" color="rgba(255,99,132,1)" />
            <LineChart labels={timestamps} data={brightnessData} label="Kecerahan" color="rgba(255,206,86,1)" />
          </div>
        </div>
        
        {/* Tabel Data */}
        <div className="bg-white shadow-md rounded p-4 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Data Tabel</h2>
            <table className="min-w-full bg-white border border-black">
            <thead>
                <tr>
                <th className="px-4 py-2 text-black border border-black">ID</th>
                <th className="px-4 py-2 text-black border border-black">Temperature</th>
                <th className="px-4 py-2 text-black border border-black">Humidity</th>
                <th className="px-4 py-2 text-black border border-black">Brightness</th>
                <th className="px-4 py-2 text-black border border-black">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr key={item.id}>
                    <td className="border px-4 py-2 text-black border border-black">{item.id}</td>
                    <td className="border px-4 py-2 text-black border border-black">{item.temperature}°C</td>
                    <td className="border px-4 py-2 text-black border border-black">{item.humidity}%</td>
                    <td className="border px-4 py-2 text-black border border-black">{item.brightness}</td>
                    <td className="border px-4 py-2 text-black border border-black">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </>
  );
}
