import axios from 'axios';
import {camelizeKeys} from 'humps';

function api() {
  const instance = axios.create({
    baseURL: `http://192.168.100.5:3001`,
    headers: {'Content-Type': 'application/json'},
  });

  instance.interceptors.request.use(
    async function (config) {
      config.headers = {...config.headers};

      return config;
    },

    function (error) {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      return camelizeKeys(response);
    },
    async function (error) {
      if (error?.response?.status == 401) {
        //adicionar aqui de roteamento para tela de login
      } else if (error?.response?.status == 409) {
        //Implementar aqui lógica de modal para APP desatualizado
      }

      return Promise.reject(error.response?.data || error);
    },
  );

  return instance;
}

export {api};
