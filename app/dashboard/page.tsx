'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/Navbar';

interface Tour {
  _id: string;
  title: string;
  description?: string;
}

export default function Dashboard() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tours', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTours(res.data);
      } catch (err: any) {
        setError('Failed to fetch tours. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tours/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTours(tours.filter(t => t._id !== id));
    } catch {
      alert('Failed to delete tour');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-400 p-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-10 border border-blue-100 w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-700 text-center font-sans">Your Product Tours</h1>
        <button
          className="mb-8 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition text-lg"
          onClick={() => router.push('/tour/new')}
        >
          + Create New Tour
        </button>
        {loading ? (
          <div className="text-blue-700 font-semibold text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center font-semibold">{error}</div>
        ) : tours.length === 0 ? (
          <div className="text-gray-700 text-center">No tours found. Create your first tour!</div>
        ) : (
          <ul className="space-y-6">
            {tours.map(tour => (
              <li key={tour._id} className="flex items-center justify-between border p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 shadow">
                <div>
                  <div className="font-bold text-xl text-indigo-700 mb-1">{tour.title}</div>
                  <div className="text-gray-600 text-sm">{tour.description}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition"
                    onClick={() => router.push(`/tour/${tour._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition"
                    onClick={() => handleDelete(tour._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600 transition"
                    onClick={() => router.push(`/analytics/${tour._id}`)}
                  >
                    Analytics
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 