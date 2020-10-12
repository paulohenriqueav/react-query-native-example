import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Input, Spinner, Button} from '@ui-kitten/components';
import {useMutation} from 'react-query';

import {authenticate} from '../../Api/auth';
import {writeToStorage, readFromStorage} from '../../Storage/manage-storage';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const token = await readFromStorage('authToken');

      setUserToken(token);
    }

    getToken();
  }, []);

  const [mutate, {isLoading}] = useMutation(
    function () {
      return authenticate({
        username,
        password,
      });
    },
    {
      onSuccess: async function (e) {
        await writeToStorage('authToken', e.token);
        setUserToken(e.token);
      },
    },
  );

  function LoadingIndicator() {
    if (isLoading) {
      return (
        <View>
          <Spinner size="small" />
        </View>
      );
    }

    return null;
  }

  console.log(userToken);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{padding: 16}}>
        <Text>User Token: {userToken}</Text>
        <Text>Logged: {userToken ? 'true' : 'false'}</Text>
        <Input
          placeholder="Digite o username"
          value={username}
          onChangeText={(nextValue) => setUsername(nextValue)}
        />
        <Input
          value={password}
          label="Password"
          placeholder="Digite a senha"
          caption="A senha precisa ter ao menos 8 dígitos"
          secureTextEntry={true}
          onChangeText={(nextValue) => setPassword(nextValue)}
        />
        <Button
          appearance="outline"
          accessoryLeft={LoadingIndicator}
          onPress={mutate}>
          Login
        </Button>
      </View>
    </View>
  );
}

export {Login};
