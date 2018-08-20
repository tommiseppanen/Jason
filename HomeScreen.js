/**
 * Jason
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import DayInfo from './DayInfo';
import TimeStore from './TimeStore';

import { strings } from './locales/i18n';

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

  async updateStateWithNewItem(item) {
    const key = getDaysSinceBirthday(item, this.state.birthday);
    let times = this.state.times;
    if (!(key.toString() in times)) {
      times[key] = [];
    }
    times[key].push(item);

    this.setState({ times: times});
    this.props.navigation.setParams({
      title: this.getNextFeeding(this.state.feedingInterval)
    });
  }
  


  groupByDate(data, birthday) {
    return _.groupBy(data, value => getDaysSinceBirthday(value, birthday));
  }

  getDaysSinceBirthday(item, birthday) {
    var duration = moment.duration(moment(item.time).diff(birthday));
    return Math.floor(duration.asHours() / 24);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1976D2"/>
        <View style={styles.buttonBar}>
          <Button
            onPress={() => this.addTime("food")}
            title={`🍼 ${strings('home.food')}`}
            accessibilityLabel={strings('home.food')}
          />
          <Button
            onPress={() => this.addTime("pee")}
            title={`💧 ${strings('home.pee')}`}
            accessibilityLabel={strings('home.pee')}
          />
          <Button
            onPress={() => this.addTime("poo")}
            title={`💩 ${strings('home.poo')}`}
            accessibilityLabel={strings('home.poo')}
          />
        </View>
        <FlatList
          data={this.getDays()}
          keyExtractor={(item,index) => item.toString()}
          renderItem={({item}) => 
          <DayInfo day={parseInt(item)+1} 
            times={this.state.times[item]} navigation={this.props.navigation}
            refresh={this.refreshState.bind(this)}>
          </DayInfo>}
        />       
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
        return `${strings('home.nextFeeding')} ${moment(orderedTimes[0].time).add(feedingInterval, 'minutes').format('HH:mm')}`;
      }        
    }
    return "";
  }

  getDays() {
    let days = Object.keys(this.state.times).map((key) => parseInt(key));
    //sort descending
    days.sort(function(a, b){return b - a});
    return days;
  }

  async addTime(type) {
    const currentTimeJson = new Date().toJSON();
    const newEntry = {type: type, time: currentTimeJson};
    this.updateStateWithNewItem(data);

    //store to disk
    let data = await TimeStore.readData();    
    data.push(newEntry);    
    await TimeStore.storeData(data);
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
