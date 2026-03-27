// const BASE_URL = "http://localhost:4000/api";
const BASE_URL = "http://13.201.106.190:4000/api";

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const getMultipartHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const api = {
  post: async (url, data) => {
    const headers = getHeaders();
    const response = await fetch(BASE_URL + url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) {
      throw { response: { data: json } };
    }
    return { data: json };
  },
  get: async (url) => {
    const headers = getHeaders();
    const response = await fetch(BASE_URL + url, {
      method: "GET",
      headers,
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) {
      throw { response: { data: json } };
    }
    return { data: json };
  },
  patch: async (url, data) => {
    const headers = getHeaders();
    const response = await fetch(BASE_URL + url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) {
      throw { response: { data: json } };
    }
    return { data: json };
  },
  delete: async (url) => {
    const headers = getHeaders();
    const response = await fetch(BASE_URL + url, {
      method: "DELETE",
      headers,
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) {
      throw { response: { data: json } };
    }
    return { data: json };
  },
  upload: async (url, formData) => {
    const headers = getMultipartHeaders();
    const response = await fetch(BASE_URL + url, {
      method: "POST",
      headers,
      body: formData,
      credentials: 'include',
    });
    const json = await response.json();
    if (!response.ok) {
      throw { response: { data: json } };
    }
    return { data: json };
  },
};

export default api;
