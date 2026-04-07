import React from 'react';
import { BookOpen, CheckCircle2, ShieldAlert, Droplets } from 'lucide-react';

const tips = [
  {
    title: "Stay Hydrated",
    content: "Drink plenty of water throughout the day. Dehydration can trigger a sickle cell crisis.",
    icon: <Droplets className="text-blue-500" />
  },
  {
    title: "Avoid Extreme Temperatures",
    content: "Both extreme cold and extreme heat can trigger crises. Dress appropriately for the weather.",
    icon: <ShieldAlert className="text-orange-500" />
  },
  {
    title: "Regular Checkups",
    content: "Visit your healthcare provider regularly for screenings and vaccinations.",
    icon: <CheckCircle2 className="text-green-500" />
  },
  {
    title: "Know Your Genotype",
    content: "Understanding your genotype (SS, SC, etc.) helps in better management and family planning.",
    icon: <BookOpen className="text-purple-500" />
  }
];

export const Education = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">Health Education</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-3">{tip.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
        <h3 className="font-bold text-red-900 mb-2">Emergency Signs</h3>
        <ul className="text-sm text-red-800 space-y-2 list-disc pl-4">
          <li>Severe pain that doesn't improve with home treatment</li>
          <li>Fever over 38.5°C (101.3°F)</li>
          <li>Difficulty breathing or chest pain</li>
          <li>Sudden weakness or numbness</li>
          <li>Severe headache or dizziness</li>
        </ul>
      </div>
    </div>
  );
};
