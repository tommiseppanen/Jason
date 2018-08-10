import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

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
          <Text key={time.time} style={styles.time}>
            {this.formatTime(time.time)} {this.getEmoji(time.type)} {time.type}
          </Text>)} 
        </View>
        <View>
          <Text style={styles.count}>🍼 {this.getCount("food")}</Text>
          <Text style={styles.count}>💧 {this.getCount("pee")}</Text>
          <Text style={styles.count}>💩 {this.getCount("poo")}</Text>
        </View>
      </View>
      
      
    );
  }

  orderTimes() {
    return _.orderBy(this.props.times, ['time'], ['desc']);
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

  getCount(type) {
    return _.filter(this.props.times, (t) => { if (t.type === type) return t }).length;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 10
  },
  day: {
    fontSize: 80,
    color: '#00000018',
    lineHeight: 80
  },
  count: {
    fontSize: 30,
    color: 'black'
  },
  time: {
    color: 'black'
  },
});
