import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';
import { store } from '../store';

interface UserData {
  [key: string]: any; 
}

interface ApiError {
  response: {
    data: {
      error: string;
    }
  }
}

const BASE_URL: string = "http://ec2-34-207-200-186.compute-1.amazonaws.com";

const getHttpOptions = () => {
  let headers:any = {};
    
    headers['Authorization'] = `Bearer ${store.getState().auth.token}`;
    headers['Cache-Control'] = 'no-cache';
    headers['Content-Type'] = 'application/json';

  return { headers };
};

export const ApiPostNoAuth = (type: string, userData: UserData): Promise<AxiosResponse | ApiError> => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + type, userData, {headers: {"Content-Type" : 'application/json', "accept": "*/*"}})
      .then((response:any) => {
        resolve(response);
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          reject(error.response.data);
        } else {
          reject(error.response?.data);
        }
      });
  });
};

export const ApiPost = (type: string, userData: UserData): Promise<AxiosResponse | ApiError> => {
  return new Promise((resolve, reject) => {
    axios.post(BASE_URL + type, userData, getHttpOptions())
      .then((response:any) => {
        resolve(response);
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          reject(error.response.data);
        } else {
          reject(error.response?.data);
        }
      });
  });
};

export const ApiGet = (type: string): Promise<AxiosResponse | ApiError> => {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + type, {headers: {"Content-Type" : 'application/json', "accept": "*/*"}})
      .then((response:any) => {
        resolve(response);
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          reject(error.response.data);
        } else {
          reject(error.response?.data);
        }
      });
  });
};




// Follow the pattern above to convert the rest of the functions to TypeScript, adding specific types or interfaces as necessary for parameters and return types.
