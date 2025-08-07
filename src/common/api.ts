import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const defaultHeaders = {
  authorization: typeof window !== "undefined"
    ? `Bearer ${localStorage.getItem("9x4kz5t7e2m1lqf")}`
    : "",
};

export const postApi = async (url: any, data: any, customHeaders = {}) => {
  try {

    const headers = {
      ...defaultHeaders,
      ...customHeaders
    }
    const response = await axios.post(url, data, { headers, withCredentials: true });
    toast.success(response?.data?.message || 'Success');
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message);
    // console.error('API Error:', error.response || error.message);
  }
};

export const putApi = async (url: any, data: any, customHeaders = {}) => {
  try {
    const headers = {
      ...defaultHeaders,
      ...customHeaders
    }
    const response = await axios.put(url, data, { headers });
    toast.success(response?.data?.message);
    return response.data;
  } catch (error) {
    console.log(error);

    // toast.error(error?.response?.data?.message);
    // console.error('API Error:', error.response || error.message);
  }
};

export const getApi = async (url: any) => {
  try {
    const response = await axios.get(url, { headers: defaultHeaders });
    // const response = await axios.get(url);
    return response;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    // console.error('API Error:', error.response || error.message);
    console.log(error);
  }
};

export const patchApi = async (url: any, data: any, customHeaders = {}) => {
  try {
    const headers = {
      ...defaultHeaders,
      ...customHeaders
    }
    const response = await axios.patch(url, data, { headers });
    toast.success(response?.data?.message);
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}

export const getRoleFromToken = () => {
  const token = localStorage.getItem('9x4kz5t7e2m1lqf');
  if (!token) {
    return false;
  }
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken) {
      return true
    }
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
};