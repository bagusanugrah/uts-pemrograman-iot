// pages/index.js
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Selamat datang di Dashboard. Gunakan navigasi di atas untuk melihat statistik suhu dan seluruh data sensor.</p>
      </div>
    </>
  );
}
