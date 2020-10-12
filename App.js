import React from 'react';
import 'react-native-gesture-handler';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ReactQueryConfigProvider} from 'react-query';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from './src/Screens/Login/login';

const queryConfig = {
  refetchAllOnWindowFocus: true,
  retry: 0,
  staleTime: 60000,
};

const Stack = createStackNavigator();

function App() {
  return (
    <>
      <ReactQueryConfigProvider config={queryConfig}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </ReactQueryConfigProvider>
    </>
  );
}

export default App;
