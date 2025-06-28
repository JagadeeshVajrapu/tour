'use client';
import { useRef, useState } from 'react';

export default function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      setVideoURL(URL.createObjectURL(blob));
      chunks.current = [];
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-2 rounded-lg font-bold shadow transition text-lg focus:outline-none focus:ring-2 focus:ring-teal-400 ${
          recording
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-teal-600 text-white hover:bg-teal-700'
        }`}
      >
        {recording ? 'Stop Recording' : 'Start Screen Recording'}
      </button>
      {videoURL && (
        <div className="mt-4">
          <video src={videoURL} controls className="w-full rounded shadow" />
        </div>
      )}
    </div>
  );
} 