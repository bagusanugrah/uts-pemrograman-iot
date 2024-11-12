import React from "react";

export default function DataTable({ data }) {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-8">
      <h2 className="text-xl font-semibold">Data Suhu & Humiditas Maksimum</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Suhu</th>
            <th className="px-4 py-2">Humidity</th>
            <th className="px-4 py-2">Kecerahan</th>
            <th className="px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.idx}>
              <td className="border px-4 py-2">{item.idx}</td>
              <td className="border px-4 py-2">{item.suhu}°C</td>
              <td className="border px-4 py-2">{item.humid}%</td>
              <td className="border px-4 py-2">{item.kecerahan}</td>
              <td className="border px-4 py-2">
                {new Date(item.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
