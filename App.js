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

import DayInfo from './DayInfo';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = { times: {}}
    this.dataKey = 'times';
    this.birthTime = new moment(new Date(2000, 1, 2, 3, 4));
  }

  async componentDidMount() {
    await this.updateState();
  }
  
  async updateState() {  
    const data = await this.readData();
    this.setNewState(data);
  }

  async setNewState(data) {
    const grouped = this.groupByDate(data);
    this.setState({ times: grouped});
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
    return _.groupBy(data, value => {
      var duration = moment.duration(moment(value.time).diff(this.birthTime));
      return Math.floor(duration.asHours() / 24);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#3F6B9C"/>
        <View style={styles.topBar}>
          <Text style={styles.header}>
            Next feeding 11:15
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
        <ScrollView>
          {this.getDays().map((key) =>
            <DayInfo key={key} day={parseInt(key)+1} times={this.state.times[key]}></DayInfo>)}
        </ScrollView>
        
        
      </View>
    );
  }

  getDays() {
    var days = Object.keys(this.state.times);
    days.sort();
    days.reverse();
    return days;
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
  topBar: {
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
  startTime: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
});
