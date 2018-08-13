import {
  AsyncStorage
} from 'react-native';

const dataKey = 'times';

export default class TimeStore {
  static async readData() {
    let data = [];
    try {            
      const value = await AsyncStorage.getItem(dataKey);
      if (value !== null) {
        data = JSON.parse(value); 
      }
    } catch (error) {
      console.log(error);
    } 
    return data;
  }

  static async storeData(data) {
    await AsyncStorage.setItem(dataKey, JSON.stringify(data));
  }
}