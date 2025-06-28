'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Navbar from '../../../components/Navbar';

const ScreenRecorder = dynamic(() => import('../../../components/ScreenRecorder'), { ssr: false });
const TourPreview = dynamic(() => import('../../../components/TourPreview'), { ssr: false });

interface Step {
  image: string;
  annotation: string;
  order: number;
}

export default function TourEditor() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isNew) {
      const fetchTour = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:5000/api/tours/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTitle(res.data.title);
          setDescription(res.data.description || '');
          setSteps(res.data.steps || []);
        } catch {
          setError('Failed to load tour');
        }
      };
      fetchTour();
    }
  }, [isNew, params.id]);

  const handleStepChange = (idx: number, field: keyof Step, value: string) => {
    setSteps(steps.map((step, i) => i === idx ? { ...step, [field]: value } : step));
  };

  const addStep = () => {
    setSteps([...steps, { image: '', annotation: '', order: steps.length + 1 }]);
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (isNew) {
        await axios.post('http://localhost:5000/api/tours', { title, description, steps }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Tour created! Redirecting...');
      } else {
        await axios.put(`http://localhost:5000/api/tours/${params.id}`, { title, description, steps }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Tour updated!');
      }
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch {
      setError('Failed to save tour');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <Navbar />
      <div className="w-full max-w-2xl mt-8">
        <ScreenRecorder />
        <form onSubmit={handleSubmit} className="bg-white/90 p-10 rounded-xl shadow-lg w-full border border-blue-100 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">{isNew ? 'Create' : 'Edit'} Product Tour</h2>
          <input
            type="text"
            placeholder="Tour Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder:text-indigo-400 placeholder:font-normal text-gray-800 text-lg bg-white"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder:text-indigo-400 placeholder:font-normal text-gray-800 text-lg bg-white"
          />
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-blue-700 text-lg">Steps</h3>
            {steps.map((step, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={step.image}
                    onChange={e => handleStepChange(idx, 'image', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder:text-indigo-400 placeholder:font-normal text-gray-800 text-lg bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Annotation"
                    value={step.annotation}
                    onChange={e => handleStepChange(idx, 'annotation', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder:text-indigo-400 placeholder:font-normal text-gray-800 text-lg bg-white"
                    required
                  />
                  <button type="button" onClick={() => removeStep(idx)} className="px-2 py-1 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition">Remove</button>
                </div>
                {step.image && (
                  <img src={step.image} alt="Step" className="max-h-32 rounded border mx-auto" />
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition">+ Add Step</button>
          </div>
          {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center font-semibold">{success}</div>}
          <button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg shadow hover:bg-teal-700 transition">{isNew ? 'Create Tour' : 'Update Tour'}</button>
          <button type="button" className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition" onClick={() => router.push('/dashboard')}>Cancel</button>
        </form>
        <button
          type="button"
          className="mb-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition"
          onClick={() => setPreview(!preview)}
        >
          {preview ? 'Exit Preview' : 'Preview Tour'}
        </button>
        {preview && (
          <div>
            <TourPreview steps={steps} currentStep={currentStep} />
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                disabled={currentStep === steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 