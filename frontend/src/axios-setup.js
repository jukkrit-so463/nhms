/*
  Runtime shim to ensure frontend works behind Nginx reverse proxy in Docker.
  It transparently rewrites any hardcoded http://localhost:3001 to relative URLs.
*/

import axios from 'axios';

const BACKEND_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

function normalizeUrl(input) {
  if (typeof input !== 'string') return input;
  if (input.startsWith('http://localhost:3001')) {
    return input.replace('http://localhost:3001', '');
  }
  return input;
}

// Set a safe default baseURL so calls like axios.get('/api/...') work
axios.defaults.baseURL = BACKEND_ORIGIN;

// Intercept axios requests
axios.interceptors.request.use((config) => {
  if (config && typeof config.url === 'string') {
    config.url = normalizeUrl(config.url);
  }
  return config;
});

// Patch window.fetch for any direct fetch usage
if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const newInput = typeof input === 'string' ? normalizeUrl(input) : input;
    return originalFetch(newInput, init);
  };
}


