'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar({ title = "Product Tour" }) {
  const router = useRouter();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-3 rounded-xl mb-8">
      <div className="font-bold text-lg text-gray-900 tracking-tight">{title}</div>
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:text-red-800 transition"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="text-gray-700 font-semibold hover:text-teal-600 transition">Login</Link>
        )}
      </div>
    </nav>
  );
} 