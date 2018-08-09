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
    //this.state = { times: []}
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
        <Text style={styles.day}>Day {this.props.day}</Text>
        <View>
          {this.props.times.map((time) =>
          <Text key={time.time} style={styles.startTime}>
            {this.formatTime(time.time)} {this.getEmoji(time.type)} {time.type}
          </Text>)} 
        </View>
        <View>
          <Text style={styles.count}>🍼 10</Text>
          <Text style={styles.count}>💧 10</Text>
          <Text style={styles.count}>💩 10</Text>
        </View>
      </View>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 10
  },
  day: {
    fontSize: 40
  },
  count: {
    fontSize: 30
  },
  currentDay: {
    backgroundColor: '#039BE5',
    alignSelf: 'stretch',
    padding: 10,
  },
});
