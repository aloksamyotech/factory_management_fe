import axios from 'axios';
import { toast } from 'react-toastify';

// const defaultHeaders = {
//   authorization: `Bearer ${localStorage.getItem("token")}`
// };

export const postApi = async (url: any, data: any, customHeaders = {}) => {
  try {

    const headers = {
      // ...defaultHeaders,
      ...customHeaders
    }
    const response = await axios.post(url, data, { headers });
    toast.success('aaaa');
    return response.data;
  } catch (error) {
    console.log(error);

    // toast.error(error?.response?.data?.message);
    // console.error('API Error:', error.response || error.message);
  }
};

export const putApi = async (url: any, data: any, customHeaders = {}) => {
  try {
    const headers = {
      // ...defaultHeaders,
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
    // const response = await axios.get(url, { headers: defaultHeaders });
    const response = await axios.get(url);
    return response;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    // console.error('API Error:', error.response || error.message);
    console.log(error);
  }
};

export const patchApi = async (url: any, data: any) => {
  try{
    const response = await axios.patch(url, data);
    toast.success(response?.data?.message);
    return response.data;
  }
  catch(err){
    console.log(err);
  }
}