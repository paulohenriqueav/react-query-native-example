import AsyncStorage from '@react-native-community/async-storage';
import {queryCache} from 'react-query';

const writeToStorage = async function (key, data) {
  await AsyncStorage.setItem(key, JSON.stringify(data));

  queryCache.setQueryData(key, data, {cacheTime: 'Infinity'});
};

const readFromStorage = async function (key) {
  const data = await AsyncStorage.getItem(key);

  queryCache.setQueryData(key, data, {cacheTime: 'Infinity'});
  return data;
};

export {readFromStorage, writeToStorage};
