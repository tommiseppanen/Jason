import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import { createStackNavigator } from 'react-navigation';
import EditScreen from './EditScreen';

export default class DayInfo extends Component { 
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.day}>{this.props.day}</Text>
        <View>
          {this.orderTimes().map((time) =>
          <TouchableHighlight key={time.time} onPress={() => this.openEditScreen(time)} underlayColor="#0eaefc">
            <View style={styles.button}>
              <Text style={styles.time}>
                {this.formatText(time)}
              </Text>
            </View>
          </TouchableHighlight>
          )} 
        </View>
        <View style={styles.countContainer}>
          <Text style={styles.count}>🍼 {this.getCount("food")}</Text>
          <Text style={styles.count}>💧 {this.getCount("pee")}</Text>
          <Text style={styles.count}>💩 {this.getCount("poo")}</Text>
        </View>
      </View>
      
      
    );
  }

  openEditScreen(time) {
    EditScreen.navigationOptions.title = this.formatText(time);
    this.props.navigation.navigate('Edit', { onGoBack: this.props.refresh, time: time});
  }

  orderTimes() {
    return _.orderBy(this.props.times, ['time'], ['desc']);
  }

  formatTime(time) {
    return moment(time).format('HH:mm');
  }

  //TODO: create enumeration for types
  getEmoji(type) {
    if (type === "food")
      return "🍼";
    else if (type === "pee")
      return "💧";
    else if (type === "poo")
      return "💩";

    return "";  
  }

  getCount(type) {
    return _.filter(this.props.times, (t) => { if (t.type === type) return t }).length;
  }

  formatText(time) {
    return `${this.formatTime(time.time)} ${this.getEmoji(time.type)} ${time.type}`;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10
  },
  day: {
    fontSize: 80,
    color: '#00000018',
    lineHeight: 80,
    minWidth: 90
  },
  count: {
    fontSize: 30,
    color: 'black'
  },
  countContainer: {
    minWidth: 70
  }, 
  time: {
    color: 'black'
  },
});
