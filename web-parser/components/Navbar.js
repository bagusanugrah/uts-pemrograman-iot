// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-white font-bold text-xl">
          Dashboard
        </Link>
        <div className="space-x-4">
          <Link href="/suhu-stats" className="text-white">
            Statistik Suhu
          </Link>
          <Link href="/seluruh-data" className="text-white">
            Seluruh Data
          </Link>
          <Link href="/controlling-pompa" className="text-white">
            Controlling Pompa
          </Link>
        </div>
      </div>
    </nav>
  );
}
