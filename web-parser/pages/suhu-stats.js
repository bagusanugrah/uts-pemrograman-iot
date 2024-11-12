// pages/suhu-stats.js
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Head from "next/head";

export default function SuhuStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/data/").then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Statistik</title>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4 text-black">
        <h1 className="text-2xl font-bold mb-4">Statistik Suhu</h1>
        <div className="bg-white shadow-md rounded p-4 mb-8">
          <h2 className="text-xl font-semibold">Statistik</h2>
          <p>Suhu Maksimum: {data.suhumax}°C</p>
          <p>Suhu Minimum: {data.suhumin}°C</p>
          <p>Suhu Rata-rata: {data.suhurata}°C</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 mb-8">
          <h2 className="text-xl font-semibold">Data Suhu & Humiditas Maksimum</h2>
          <table className="min-w-full bg-white border border-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-black">ID</th>
                <th className="px-4 py-2 border border-black">Suhu</th>
                <th className="px-4 py-2 border border-black">Humidity</th>
                <th className="px-4 py-2 border border-black">Kecerahan</th>
                <th className="px-4 py-2 border border-black">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.nilai_suhu_max_humid_max.map((item) => (
                <tr key={item.idx}>
                  <td className="border px-4 py-2 border border-black">{item.idx}</td>
                  <td className="border px-4 py-2 border border-black">{item.suhu}°C</td>
                  <td className="border px-4 py-2 border border-black">{item.humid}%</td>
                  <td className="border px-4 py-2 border border-black">{item.kecerahan}</td>
                  <td className="border px-4 py-2 border border-black">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

