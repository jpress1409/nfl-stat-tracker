import React, { useState, useEffect } from 'react';
import { getReceivingStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Download } from 'lucide-react';

const ReceivingStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    loadStats();
  }, [year]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getReceivingStats(year);
      setStats(data.slice(0, 20));
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats.slice(0, 10).map(player => ({
    name: player.player_name.split(' ').pop(),
    yards: player.receiving_yards,
    receptions: player.receptions,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wide Receiver Receiving Stats</h2>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {[2024, 2023, 2022, 2021, 2020].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Top 10 WRs by Receiving Yards</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Bar dataKey="yards" fill="#3b82f6" name="Receiving Yards" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Season Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Receptions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Targets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Yards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {stats.map((player, index) => (
                <tr key={player.player_id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{player.player_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{player.receptions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{player.targets}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-semibold">{player.receiving_yards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceivingStats;
