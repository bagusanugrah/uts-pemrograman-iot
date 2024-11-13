// pages/controlling-pompa.js
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // Import Navbar
import Head from "next/head"; // Untuk menambahkan title

export default function ControllingPompa() {
  const [status, setStatus] = useState("");

  const handlePompaControl = async (command) => {
    try {
      await axios.post("http://localhost:8000/mqtt-publish", {
        topic: "iot/hydroponic-152022029/pompa",
        message: command,
      });
      setStatus(command === "ON" ? "Pompa menyala." : "Pompa dimatikan.");
    } catch (error) {
      console.error("Error mengontrol pompa:", error);
      setStatus("Gagal mengontrol pompa.");
    }
  };

  return (
    <>
      <Head>
        <title>Controlling Pompa</title>
      </Head>
      <Navbar /> {/* Tambahkan Navbar */}
      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Kontrol Pompa</h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handlePompaControl("ON")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mr-4 shadow-lg transition duration-200 ease-in-out"
          >
            Nyalakan Pompa
          </button>
          <button
            onClick={() => handlePompaControl("OFF")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out"
          >
            Matikan Pompa
          </button>
        </div>
        <div className="text-center text-lg text-gray-700 font-semibold">
          <p>{status}</p>
        </div>
      </div>
    </>
  );
}
