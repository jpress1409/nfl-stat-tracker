import React, { useState } from 'react';
import { BarChart3, Users, TrendingUp, Brain } from 'lucide-react';
import ReceivingStats from './components/ReceivingStats';
import TeamStats from './components/TeamStats';
import Prediction from './components/Prediction';

function App() {
  const [activeTab, setActiveTab] = useState('receiving');

  const tabs = [
    { id: 'receiving', label: 'Receiving Stats', icon: BarChart3 },
    { id: 'team', label: 'Team Stats', icon: Users },
    { id: 'prediction', label: 'Prediction', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-blue-400" />
            NFL Stats Dashboard
          </h1>
        </div>
      </header>

      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'receiving' && <ReceivingStats />}
        {activeTab === 'team' && <TeamStats />}
        {activeTab === 'prediction' && <Prediction />}
      </main>
    </div>
  );
}

export default App;
