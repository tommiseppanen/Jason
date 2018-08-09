/**
 * Jason
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  ScrollView
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = { times: []}
    this.dataKey = 'times';
    
  }

  async componentDidMount() {
    await this.updateState();
  }
  
  async updateState() {  
    const data = await this.readData();
    this.setNewState(data);
  }

  async setNewState(data) {
    this.setState({ times: _.orderBy(data, ['time'], ['desc'])});
  }
  
  async readData() {
    let data = [];
    try {            
      const value = await AsyncStorage.getItem(this.dataKey);
      if (value !== null) {
        data = JSON.parse(value); 
      }
    } catch (error) {
        console.log(error);
    }
  
    return data;
  }

  groupByDate(data) {
    //_.groupBy(data, value => );
  }


  async food() {
    await this.addTime("food");
  }

  async pee() {
    await this.addTime("pee");
  }

  async poo() {
    await this.addTime("poo");
  }

  async addTime(type) {
    let data = await this.readData();
    const currentTimeJson = new Date().toJSON(); 
    data.push({type: type, time: currentTimeJson});
    this.setNewState(data);
    await AsyncStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  formatTime(time) {
     return moment(time).format('HH:mm');
  }

  getEmoji(type) {
    if (type === "food")
      return "🍼";
    else if (type === "pee")
      return "💧";
    else if (type === "poo")
      return "💩";

    return "";  
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#3F6B9C"/>
        <View style={styles.currentDay}>
          <Text style={styles.header}>
            Next feeding
          </Text>
          <Text style={styles.headerDetail}>
            11:15
          </Text>
        </View>
        <View style={styles.buttonBar}>
          <Button
            onPress={this.food.bind(this)}
            title="🍼 Food"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={this.pee.bind(this)}
            title="💧 Pee"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={this.poo.bind(this)}
            title="💩 Poo"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <ScrollView contentContainerStyle={styles.times}>
          {this.state.times.map((time) =>
            <Text key={time.time} style={styles.startTime}>
            {this.formatTime(time.time)} {this.getEmoji(time.type)} {time.type}
            </Text>
          )}
        </ScrollView>
        
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
  },
  buttonBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 10
  },
  times: {
  },
  currentDay: {
    backgroundColor: '#039BE5',
    alignSelf: 'stretch',
    padding: 10,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  headerDetail: {
    fontSize: 16,
    textAlign: 'center',
    margin: 3,
    color: 'white',
  },
  startTime: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
});
