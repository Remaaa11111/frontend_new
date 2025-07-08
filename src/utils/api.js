export const getData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const sendData = async (url, formData) => {
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const deleteData = async (url, params) => {
  // params opsional, bisa untuk x-www-form-urlencoded atau FormData
  const response = await fetch(url, {
    method: 'DELETE',
    body: params,
  });
  return response.json();
}; 