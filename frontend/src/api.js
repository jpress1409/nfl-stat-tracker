import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getReceivingStats = async (year = 2024) => {
  const response = await api.get('/receiving-stats', { params: { year } });
  return response.data;
};

export const getReceivingStatsWeekly = async (year = 2024, week = null) => {
  const params = { year };
  if (week) params.week = week;
  const response = await api.get('/receiving-stats-weekly', { params });
  return response.data;
};

export const getTeamStats = async (year = 2024) => {
  const response = await api.get('/team-stats', { params: { year } });
  return response.data;
};

export const getWeeklyData = async (years = [2024], columns = []) => {
  const params = {};
  if (years.length) params.year = years;
  if (columns.length) params.columns = columns;
  const response = await api.get('/weekly-data', { params });
  return response.data;
};

export const trainModel = async () => {
  const response = await api.post('/train-model');
  return response.data;
};

export const predict = async (stats) => {
  const response = await api.post('/predict', stats);
  return response.data;
};
