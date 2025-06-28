import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-400">
      <div className="max-w-xl p-10 bg-white/90 rounded-2xl shadow-2xl text-center border border-blue-100">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-700 font-sans">Interactive Product Tour Platform</h1>
        <p className="mb-8 text-gray-700 text-lg">Create, manage, and share interactive product tours with ease. Sign up to get started or log in to your dashboard.</p>
        <div className="flex justify-center gap-6">
          <Link href="/signup" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition text-lg">Sign Up</Link>
          <Link href="/login" className="px-8 py-3 bg-white text-indigo-700 border border-indigo-300 font-bold rounded-lg shadow hover:bg-indigo-50 transition text-lg">Log In</Link>
        </div>
      </div>
    </main>
  );
}
