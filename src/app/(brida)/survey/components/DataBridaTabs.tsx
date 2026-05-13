"use client";

import { useState } from 'react';
import SurveyBuilder from './SurveyBuilder';
import SurveyList from './SurveyList';
import SurveyResults from './SurveyResults';
import SensusData from './SensusData';

// Tambahkan interface untuk mendefinisikan tipe props
interface DataBridaTabsProps {
  onDataChange: () => void;
}

export default function DataBridaTabs({ onDataChange }: DataBridaTabsProps) {
  const [activeTab, setActiveTab] = useState('builder');

  const tabs = [
    { id: 'builder', label: 'Survey Builder', icon: 'fas fa-plus-circle' },
    { id: 'list', label: 'Daftar Survey', icon: 'fas fa-list' },
    { id: 'results', label: 'Hasil Survey', icon: 'fas fa-chart-bar' },
    { id: 'sensus', label: 'Data Sensus Lokal', icon: 'fas fa-users' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6 border-b pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#e94560] text-white shadow-md'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className={tab.icon}></i> {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* Teruskan props onDataChange ke SurveyBuilder */}
        {activeTab === 'builder' && <SurveyBuilder onDataChange={onDataChange} />}
        {activeTab === 'list' && <SurveyList />}
        {activeTab === 'results' && <SurveyResults />}
        {activeTab === 'sensus' && <SensusData />}
      </div>
    </div>
  );
}