export const getData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const sendData = async (url, data, isJson = false, method = 'POST') => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  const headers = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (isJson) headers['Content-Type'] = 'application/json';

  const response = await fetch(url, {
    method,
    headers,
    body: isJson ? JSON.stringify(data) : data,
  });
  return response.json();
};

export const updateData = async (url, formData) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  const headers = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: formData,
  });
  return response.json();
};

export const deleteData = async (url) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  const headers = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  const result = await response.json();
  return {
    ...result,
    status: response.status,
    ok: response.ok,
  };
};

export const getDataWithToken = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const deleteDataWithToken = async (url, token) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
