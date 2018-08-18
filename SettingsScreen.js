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

export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
    headerStyle: {
      backgroundColor: '#2196f3',
    },
    headerTintColor: '#fff'
  };

  constructor(props){
    super(props)
    //const date = new moment(this.props.navigation.getParam('time').time);

    this.state = {date: "", time: "", interval: 180};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <DatePicker
            style={styles.datePicker}
            mode="date"
            date={this.state.date}
            placeholder="Birthday"
            onDateChange={(date) => {this.setState({date: date})}}
          />
          <DatePicker
            style={styles.datePicker}
            mode="time"
            format="HH:mm"
            date={this.state.time}
            placeholder="Birth time"
            onDateChange={(time) => {this.setState({time: time})}}
          />
          <TextInput
            keyboardType="number-pad"
            maxLength={2}
            value={String(this.state.interval/60)}
          />
        </View>
        <View style={styles.buttonBar}>
          <Button
            title="Update"
            onPress={this.updateSettigs.bind(this)}
          />
        </View>      
      </View>
    );
  }

  async updateSettigs() {
    /*const date = this.state.date;
    let data = await TimeStore.readData();

    //Delete old
    const time = this.props.navigation.getParam('time');
    const index = _.findIndex(data, { 'time': time.time, 'type': time.type });
    data.splice(index, 1);

    //Add new
    const timeJson = moment(`${this.state.date} ${this.state.time}:00.${this.getRandomMilliseconds()}`).toJSON();

    data.push({type: time.type, time: timeJson});

    TimeStore.storeData(data);
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();*/
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
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
  buttonBar: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
});
