import {api} from './api';

function authenticate({username, password}) {
  return api()
    .post(`login`, {email: username, password})
    .then((response) => {
      return response.data;
    });
}

export {authenticate};
