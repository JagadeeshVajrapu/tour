import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-lg mt-8">
        <Navbar title="CHEI" />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Interactive Product Tours</h1>
          <p className="mb-8 text-gray-600">Build guided tours to showcase your product</p>
          <Link href="/signup" className="inline-block px-8 py-3 bg-teal-600 text-white font-bold rounded-lg shadow hover:bg-teal-700 transition mb-6">Get Started</Link>
          <div className="flex justify-center mt-8">
            {/* You can use an SVG or Heroicon here */}
            <img src="/tour-illustration.svg" alt="Tour Illustration" className="w-40 h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
