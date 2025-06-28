'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface StepAnalytics {
  step: number;
  timeSpent: number;
}

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<{ views: number; steps: StepAnalytics[] } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/analytics/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch {
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [params.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-400 p-8">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-blue-100">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-indigo-700 font-sans">Tour Analytics</h2>
        <button className="mb-6 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-lg shadow hover:from-indigo-600 hover:to-blue-600 transition" onClick={() => router.push('/dashboard')}>Back to Dashboard</button>
        {loading ? (
          <div className="text-blue-700 font-bold text-center animate-pulse">Loading analytics...</div>
        ) : error ? (
          <div className="text-red-600 text-center font-bold animate-pulse">{error}</div>
        ) : data ? (
          <>
            <div className="mb-6 text-lg text-center">
              Total Views: <span className="font-bold text-indigo-600 text-2xl">{data.views}</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-700 text-lg">Time Spent Per Step (seconds)</h3>
              {data.steps.length === 0 ? (
                <div className="text-indigo-400 font-normal text-center">No analytics data available yet.</div>
              ) : (
                <table className="w-full border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-100 to-blue-100">
                      <th className="p-2 border text-indigo-700 font-normal">Step</th>
                      <th className="p-2 border text-indigo-700 font-normal">Time Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.steps.map((step) => (
                      <tr key={step.step} className="hover:bg-blue-50">
                        <td className="p-2 border text-center text-blue-800 font-semibold">{step.step}</td>
                        <td className="p-2 border text-center text-indigo-800 font-bold">{step.timeSpent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
} 