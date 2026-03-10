import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

export const createOrUpdateProfile = (data) => API.post('/candidate/profile', data);
export const getMyProfile = () => API.get('/candidate/profile/me');
export const getProfileById = (id) => API.get(`/candidate/profile/${id}`);

export const getCandidateMatches = () => API.get('/candidate/matches');

export const createJob = (data) => API.post('/jobs', data);
export const getMyJobs = () => API.get('/jobs/my-jobs');
export const getJobById = (id) => API.get(`/jobs/${id}`);

export const runMatching = (jobId) => API.post(`/match/job/${jobId}`);
export const getMatchesForJob = (jobId) => API.get(`/match/job/${jobId}`);

export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/read/${id}`);

export default API;
