import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from './HomeScreen';
import EditScreen from './EditScreen';
import SettingsScreen from './SettingsScreen';

//TODO: remove this ignore when upgrading react native to 0.57
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const App = createStackNavigator({
  Home: { screen: HomeScreen },
  Edit: { screen: EditScreen },
  Settings: { screen: SettingsScreen },
},
{
  initialRouteName: 'Home',
});

export default App;