import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Input, Spinner, Button} from '@ui-kitten/components';
import {useMutation} from 'react-query';
import {useForm} from 'react-hook-form';
import {object, string} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Snackbar from 'react-native-snackbar';

import {authenticate} from '../../Api/auth';
import {writeToStorage, readFromStorage} from '../../Storage/manage-storage';

const validationSchema = object().shape({
  username: string()
    .email('O e-email é inválido')
    .required('O e-mail é obrigatório'),
  password: string()
    .min(8, 'A senha é muito curta')
    .required('A senha é obrigatório'),
});

function Login() {
  const [userToken, setUserToken] = useState('');

  const {register, handleSubmit, setValue, errors} = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    async function getToken() {
      const token = await readFromStorage('authToken');

      setUserToken(token);
    }

    getToken();
  }, []);

  useEffect(() => {
    register({name: 'username'}, {required: true});
    register({name: 'password'}, {required: true});
  }, [register]);

  const [mutate, {isLoading}] = useMutation(
    function (values) {
      return authenticate({...values});
    },
    {
      onSuccess: async function (data) {
        await writeToStorage('authToken', data.user.token);
        setUserToken(data.user.token);

        Snackbar.show({
          text: data.message,
          rtl: true,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
          textColor: 'white',
        });
      },
      onError: function (err) {
        Snackbar.show({
          text: err.message,
          rtl: true,
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'red',
        });
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

  function onsubmit({username, password}) {
    mutate({username, password});
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{padding: 16}}>
        <Text>User Token: {userToken}</Text>
        <Text style={{marginTop: 8}}>
          Logged: {userToken ? 'true' : 'false'}
        </Text>
        <Input
          placeholder="Digite o username"
          onChangeText={(nextValue) => setValue('username', nextValue, true)}
          style={{width: '100%', marginTop: 16}}
          caption={errors['username'] ? errors['username'].message : null}
        />
        <Input
          label="Password"
          placeholder="Digite a senha"
          caption="A senha precisa ter ao menos 8 dígitos"
          secureTextEntry={true}
          onChangeText={(nextValue) => setValue('password', nextValue, true)}
          caption={errors['password'] ? errors['password'].message : null}
          style={{marginTop: 16, width: '100%'}}
        />
        <Button
          appearance="outline"
          accessoryLeft={LoadingIndicator}
          onPress={handleSubmit(onsubmit)}
          style={{marginTop: 16}}>
          Login
        </Button>
      </View>
    </View>
  );
}

export {Login};
