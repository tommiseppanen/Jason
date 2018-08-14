/**
 * Jason
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  ScrollView,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import DayInfo from './DayInfo';
import TimeStore from './TimeStore';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };
  
  constructor(props){
    super(props);
    this.state = { times: {}}
    this.birthTime = new moment(new Date(2012, 1, 2, 3, 4));
  }

  async componentDidMount() {
    await this.refreshState();
  }
  
  async refreshState() {  
    const data = await TimeStore.readData();
    this.setNewState(data);
  }

  async setNewState(data) {
    const grouped = this.groupByDate(data);
    this.setState({ times: grouped});
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
            {this.getNextFeeding()}
          </Text>
        </View>
        <View style={styles.buttonBar}>
          <Button
            onPress={() => await this.addTime("food")}
            title="🍼 Food"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={() => await this.addTime("pee")}
            title="💧 Pee"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={() => await this.addTime("poo")}
            title="💩 Poo"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <ScrollView>
          {this.getDays().map((key) =>
            <DayInfo key={key} day={parseInt(key)+1} 
            times={this.state.times[key]} navigation={this.props.navigation}
            refresh={this.refreshState.bind(this)}></DayInfo>)}
        </ScrollView>
        
        
      </View>
    );
  }

  getNextFeeding()
  {
    let days = this.getDays();
    if (days.length > 0)
    {
      const feedingTimes = 
        _.filter(this.state.times[days[0]], (t) => { if (t.type === "food") return t });
      if (feedingTimes.length > 0)
      {
        const orderedTimes = _.orderBy(feedingTimes, ['time'], ['desc']);
        return `Next feeding: ${moment(orderedTimes[0].time).add(4, 'hours').format('HH:mm')}`;
      }        
    }
    return "Welcome!";
  }

  getDays() {
    let days = Object.keys(this.state.times).map((key) => parseInt(key));
    //sort descending
    days.sort(function(a, b){return b - a});
    return days;
  }

  async addTime(type) {
    let data = await TimeStore.readData();
    const currentTimeJson = new Date().toJSON(); 
    data.push({type: type, time: currentTimeJson});
    this.setNewState(data);
    TimeStore.storeData(data);
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
