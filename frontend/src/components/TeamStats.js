import React, { useState, useEffect } from 'react';
import { getTeamStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const TeamStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    loadStats();
  }, [year]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getTeamStats(year);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats.slice(0, 10).map(team => ({
    name: team.posteam,
    yards: team.yards_gained,
    epa: team.epa,
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
        <h2 className="text-2xl font-bold text-white">Team Performance Stats</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top 10 Teams by Total Yards</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="yards" fill="#10b981" name="Total Yards" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top 10 Teams by EPA per Play</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="epa" fill="#f59e0b" name="EPA per Play" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">All Team Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total Yards</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">EPA/Play</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Plays</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pass Att</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rush Att</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">TDs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {stats.map((team) => (
                <tr key={team.posteam} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{team.posteam}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">{team.yards_gained.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{team.epa.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{team.down}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{team.pass_attempt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{team.rush_attempt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-semibold">{team.touchdown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;
