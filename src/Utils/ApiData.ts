import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios';

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


const BASE_URL: string = "http://localhost:5017";




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


// Follow the pattern above to convert the rest of the functions to TypeScript, adding specific types or interfaces as necessary for parameters and return types.
