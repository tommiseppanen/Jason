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
  Button,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import DayInfo from './DayInfo';
import TimeStore from './TimeStore';

export default class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerStyle: {
        backgroundColor: '#2196f3',
      },
      title: params.title,
      headerTintColor: '#fff',
      headerRight: (<TouchableOpacity onPress={params.settingsAction}>
                      <Image style={styles.topbarButton} source={require('./img/settings.png')} />
                    </TouchableOpacity>)

    };
};
  
  constructor(props){
    super(props);
    this.state = { times: {}}
  }

  async componentDidMount() {
    await this.refreshState();
  }
  
  async refreshState() {  
    const settings = await this.readSettings();
    const data = await TimeStore.readData();
    this.setInitialState(data, moment(settings.birthday), settings.feedingInterval);
  }

  async readSettings() {
    const settings = await TimeStore.getSettings();
    if (_.isNull(settings.birthday))
    {
      settings.birthday = new Date().toJSON();
      await TimeStore.storeSettings(settings);
    }
    return settings;
  }

  async setInitialState(data, birthday, feedingInterval) {
    const grouped = this.groupByDate(data, birthday);
    this.setState({ times: grouped, birthday: birthday, 
      feedingInterval: feedingInterval});
    this.props.navigation.setParams({
      title: this.getNextFeeding(feedingInterval),
      settingsAction: () => this.props.navigation.navigate('Settings', { onGoBack: this.refreshState.bind(this)})
    });
  }

  async updateState(data) {
    const grouped = this.groupByDate(data, this.state.birthday);
    this.setState({ times: grouped});
    this.props.navigation.setParams({
      title: this.getNextFeeding(this.state.feedingInterval)
    });
  }
  


  groupByDate(data, birthday) {
    return _.groupBy(data, value => {
      var duration = moment.duration(moment(value.time).diff(birthday));
      return Math.floor(duration.asHours() / 24);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonBar}>
          <Button
            onPress={() => this.addTime("food")}
            title="🍼 Food"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={() => this.addTime("pee")}
            title="💧 Pee"
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            onPress={() => this.addTime("poo")}
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

  getNextFeeding(feedingInterval)
  {
    let days = this.getDays();
    if (days.length > 0)
    {
      const feedingTimes = 
        _.filter(this.state.times[days[0]], (t) => { if (t.type === "food") return t });
      if (feedingTimes.length > 0)
      {
        const orderedTimes = _.orderBy(feedingTimes, ['time'], ['desc']);
        return `Next feeding ${moment(orderedTimes[0].time).add(feedingInterval, 'minutes').format('HH:mm')}`;
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
    this.updateState(data);
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
  topbarButton: {
    tintColor: '#FFF',
    marginRight: 10
  }
});
