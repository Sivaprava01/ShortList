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

export const getCandidateMatches = () => API.get('/match/candidate');

export const createJob = (data) => API.post('/jobs', data);
export const getMyJobs = () => API.get('/jobs/my-jobs');
export const getJobById = (id) => API.get(`/jobs/${id}`);

export const runMatching = (jobId) => API.post(`/match/job/${jobId}`);
export const getMatchesForJob = (jobId) => API.get(`/match/job/${jobId}`);

export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/read/${id}`);

export const applyToJob = (jobId) => API.post(`/applications/apply/${jobId}`);
export const getMyApplications = () => API.get('/applications/my-applications');
export const getApplicationsForJob = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) => API.put(`/applications/${id}/status`, { status });

// Chat
export const startChat = (jobId, candidateId) => API.post(`/chat/start/${jobId}/${candidateId}`);
export const getMyChats = () => API.get('/chat/my-chats');
export const getChatMessages = (chatId) => API.get(`/chat/${chatId}`);
export const sendChatMessage = (chatId, text) => API.post(`/chat/message/${chatId}`, { text });

// Journey
export const createJourney = (data) => API.post('/journey', data);
export const getJourneyFeed = () => API.get('/journey/feed');
export const getJourneyById = (id) => API.get(`/journey/${id}`);

export default API;
