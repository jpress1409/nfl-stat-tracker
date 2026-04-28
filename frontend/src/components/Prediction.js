import React, { useState } from 'react';
import { predict, trainModel } from '../api';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

const Prediction = () => {
  const [stats, setStats] = useState({
    yards_gained: '',
    epa: '',
    down: '',
    pass_attempt: '',
    rush_attempt: '',
    touchdown: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setStats({
      ...stats,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const data = {
        yards_gained: parseFloat(stats.yards_gained) || 0,
        epa: parseFloat(stats.epa) || 0,
        down: parseFloat(stats.down) || 0,
        pass_attempt: parseFloat(stats.pass_attempt) || 0,
        rush_attempt: parseFloat(stats.rush_attempt) || 0,
        touchdown: parseFloat(stats.touchdown) || 0,
      };

      const result = await predict(data);
      setPrediction(result);
    } catch (err) {
      setError('Failed to make prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    setError('');
    try {
      await trainModel();
      alert('Model trained successfully!');
    } catch (err) {
      setError('Failed to train model. Please try again.');
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Game Outcome Prediction</h2>
        <button
          onClick={handleTrain}
          disabled={training}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Brain size={18} />
          {training ? 'Training...' : 'Train Model'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Enter Team Stats</h3>
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Total Yards Gained</label>
              <input
                type="number"
                name="yards_gained"
                value={stats.yards_gained}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 350"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">EPA per Play</label>
              <input
                type="number"
                step="0.01"
                name="epa"
                value={stats.epa}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 0.15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of Plays</label>
              <input
                type="number"
                name="down"
                value={stats.down}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 65"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Pass Attempts</label>
              <input
                type="number"
                name="pass_attempt"
                value={stats.pass_attempt}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 35"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rush Attempts</label>
              <input
                type="number"
                name="rush_attempt"
                value={stats.rush_attempt}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Touchdowns</label>
              <input
                type="number"
                name="touchdown"
                value={stats.touchdown}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., 3"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp size={18} />
              {loading ? 'Predicting...' : 'Predict Outcome'}
            </button>
          </form>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Prediction Result</h3>
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          {prediction ? (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl ${prediction.prediction === 1 ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                <div className="text-center">
                  <p className="text-slate-300 text-sm mb-2">Predicted Outcome</p>
                  <p className={`text-3xl font-bold ${prediction.prediction === 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {prediction.prediction === 1 ? 'WIN' : 'LOSS'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Win Probability</span>
                    <span className="text-green-400 font-semibold">{(prediction.win_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.win_probability * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Loss Probability</span>
                    <span className="text-red-400 font-semibold">{(prediction.lose_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.lose_probability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <p className="text-center">Enter team stats and click "Predict Outcome" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
