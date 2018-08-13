import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from './HomeScreen';
import EditScreen from './EditScreen';

const App = createStackNavigator({
  Home: { screen: HomeScreen },
  Edit: { screen: EditScreen },
},
{
  initialRouteName: 'Home',
});

export default App;