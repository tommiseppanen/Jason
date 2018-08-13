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
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import _ from 'lodash';

import TimeStore from './TimeStore';

export default class EditScreen extends Component {
  static navigationOptions = {
    title: 'Edit',
  };

  constructor(props){
    super(props)
    const date = new moment(this.props.navigation.getParam('time').time);
    this.state = {date: date, time: date};
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <DatePicker
            style={styles.datePicker}
            mode="date"
            date={this.state.date}
            placeholder="Select date"
          />
          <DatePicker
            style={styles.datePicker}
            mode="time"
            format="HH:mm"
            date={this.state.time}
            placeholder="Select time"
          />
        </View>
        <View style={styles.buttonBar}>
          <Button
            title="Delete"
            onPress={this.deleteTime.bind(this)}
          />
          <Button
            title="Save"
            onPress={() =>
              this.props.navigation.goBack()
            }
          />
        </View>      
      </View>
    );
  }

  async deleteTime() {
    let data = await TimeStore.readData();
    const time = this.props.navigation.getParam('time');
    const index = _.findIndex(data, { 'time': time.time, 'type': time.type });
    data.splice(index, 1);
    TimeStore.storeData(data);
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
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
