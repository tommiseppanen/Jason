import React, {Component} from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  ScrollView,
  TextInput
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import _ from 'lodash';

import TimeStore from './TimeStore';

import { strings } from './locales/i18n';

export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: strings('settings.settings'),
    headerStyle: {
      backgroundColor: '#2196f3',
    },
    headerTintColor: '#fff'
  };

  constructor(props){
    super(props);
    this.state = {date: null, 
      time: null, feedingInterval: ""};
  }

  async componentDidMount() {
    const settings = await TimeStore.getSettings();
    const date = moment(settings.birthday);
    this.setState({date: date.format('YYYY-MM-DD'), 
      time: date.format('HH:mm'), feedingInterval: String(settings.feedingInterval)});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.inputRow}>
            <Text>{strings('settings.birthday')}</Text>
            <DatePicker
              style={styles.datePicker}
              mode="date"
              date={this.state.date}
              placeholder={strings('settings.birthday')}
              onDateChange={(date) => {this.setState({date: date})}}
            />
          </View>
          <View style={styles.inputRow}>
            <Text>{strings('settings.birthTime')}</Text>
            <DatePicker
              style={styles.datePicker}
              mode="time"
              format="HH:mm"
              date={this.state.time}
              placeholder={strings('settings.birthTime')}
              onDateChange={(time) => {this.setState({time: time})}}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
            <Text style={styles.intervalDescription}>{strings('settings.feedingInterval')}</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={3}
              onChangeText={(interval) => {this.setState({feedingInterval: interval})}}
              value={this.state.feedingInterval}
            />
          </View>    
      </View>
    );
  }

  async componentWillUnmount() {
    const settings = await TimeStore.getSettings();
    const timeJson = moment(`${this.state.date} ${this.state.time}`).toJSON();
    settings.birthday = timeJson;
    const intervalValue = parseInt(this.state.feedingInterval);
    settings.feedingInterval = _.isNumber(intervalValue) ? intervalValue : 180;
    await TimeStore.storeSettings(settings);
    this.props.navigation.state.params.onGoBack();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF'
  },
  pickerContainer: {
    alignItems:'center'
  },
  datePicker: {
    width: 200,
    padding: 10
  },
  intervalDescription: {
    paddingRight: 20
  },
  inputRow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 10
  }
});
