import {
  AsyncStorage
} from 'react-native';

const dataKey = 'times';
const settingsKey = 'settings';

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

  static async getSettings() {
    let settings = {birthday: null, feedingInterval: 180};
    try {            
      const value = await AsyncStorage.getItem(settingsKey);
      if (value !== null) {
        settings = JSON.parse(value); 
      }
    } catch (error) {
      console.log(error);
    } 
    return settings;
  }

  static async storeSettings(settings) {
    await AsyncStorage.setItem(settingsKey, JSON.stringify(settings));
  }
}